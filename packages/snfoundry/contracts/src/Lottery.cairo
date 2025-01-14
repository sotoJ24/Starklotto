use array::ArrayTrait;
use option::OptionTrait;
use starknet::{ContractAddress, get_block_timestamp, get_caller_address};
use traits::Into;

#[derive(Drop, Serde, starknet::Store)]
//serde for serialization and deserialization
struct Ticket {
    player: ContractAddress,
    selectedNumbers: Array<u16>,
    claimed: bool,
    drawId: u64,
}

#[derive(Drop, Serde, starknet::Store)]
//serde for serialization and deserialization
struct Draw {
    drawId: u64,
    accumulatedPrize: u256,
    winningNumbers: Array<u16>,
    //map of ticketId to ticket
    tickets: Map<felt252, Ticket>,
    isActive: bool,
    //start time of the draw,timestamp unix
    startTime: u64,
    //end time of the draw,timestamp unix
    endTime: u64,
}

#[starknet::interface]
trait ILottery<TContractState> {
    fn Initialize(ref self: TContractState, owner: ContractAddress, ticketPrice: u256);
    fn BuyTicket(ref self: TContractState, drawId: u64, numbers: Array<felt252>);
    fn DrawNumbers(ref self: TContractState, drawId: u64);
    fn ClaimPrize(ref self: TContractState, drawId: u64, ticketId: felt252);
    fn CheckMatches(self: @TContractState, drawId: u64, ticketNumbers: Array<felt252>) -> u8;
    fn GetAccumulatedPrize(self: @TContractState, drawId: u64) -> u256;
    fn GetFixedPrize(self: @TContractState, matches: u8) -> u256;
    fn CreateNewDraw(ref self: TContractState);
    fn GetDrawStatus(self: @TContractState, drawId: u64) -> bool;
    fn GetUserTickets(self: @TContractState, drawId: u64) -> Array<felt252>;
    fn GetTicketInfo(self: @TContractState, drawId: u64, ticketId: felt252) -> Ticket;
}

#[starknet::contract]
mod Lottery {
    use array::ArrayTrait;
    use openzeppelin_access::ownable::OwnableComponent;
    use openzeppelin_token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};
    use option::OptionTrait;
    use starknet::storage::Map;
    use starknet::{ContractAddress, contract_address_const};
    use starknet::{ContractAddress, get_block_timestamp, get_caller_address};
    use super::{Draw, ILottery, Ticket};

    //ownable component by openzeppelin
    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);

    //ownable component by openzeppelin
    #[abi(embed_v0)]
    impl OwnableImpl = OwnableComponent::OwnableImpl<ContractState>;
    impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;

    const STRK_CONTRACT_ADRESS: felt252 =
        0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d;

    #[storage]
    struct Storage {
        ticketPrice: u256,
        draws: Map<u64, Draw>,
        currentDrawId: u64,
        currentTicketId: u64,
        fixedPrize4Matches: u256,
        fixedPrize3Matches: u256,
        fixedPrize2Matches: u256,
        //ownable component by openzeppelin
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
        accumulatedPrize: u256,
        usertickets: Map<(ContractAddress, u64), Array<felt252>>,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        OwnableEvent: OwnableComponent::Event,
        TicketPurchased: TicketPurchased,
        DrawCompleted: DrawCompleted,
        PrizeClaimed: PrizeClaimed,
    }

    #[derive(Drop, starknet::Event)]
    struct TicketPurchased {
        drawId: u64,
        player: ContractAddress,
        ticketId: felt252,
        numbers: Array<felt252>,
    }

    #[derive(Drop, starknet::Event)]
    struct DrawCompleted {
        drawId: u64,
        winningNumbers: Array<felt252>,
        accumulatedPrize: u256,
    }

    #[derive(Drop, starknet::Event)]
    struct PrizeClaimed {
        drawId: u64,
        player: ContractAddress,
        ticketId: felt252,
        prizeAmount: u256,
    }

    #[constructor]
    fn constructor(ref self: ContractState, owner: ContractAddress) {
        self.ownable.initializer(owner);
        self.fixedPrize4Matches.write(4000000000000000000);
        self.fixedPrize3Matches.write(3000000000000000000);
        self.fixedPrize2Matches.write(2000000000000000000);
        self.currentDrawId.write(0);
    }

    #[abi(embed_v0)]
    impl LotteryImpl of ILottery<ContractState> {
        //OK
        fn Initialize(ref self: ContractState, owner: ContractAddress, ticketPrice: u256) {
            self.ownable.assert_only_owner();
            self.ticketPrice.write(ticketPrice);
            self.CreateNewDraw(0);
        }

        //OK
        fn BuyTicket(ref self: ContractState, drawId: u64, numbers: Array<felt252>) {
            assert(self.validateNumbers(@numbers), 'Invalid numbers');
            let draw = self.draws.read(drawId);
            assert(draw.isActive, 'Draw is not active');

            //TODO: We need to process the payment
            let ticket = Ticket {
                player: get_caller_address(), selectedNumbers: numbers, claimed: false, drawId,
            };

            let ticketId = generateTicketId(drawId, get_caller_address(), get_block_timestamp());
            draw.tickets.write(ticketId, ticket);

            self.emit(TicketPurchased { drawId, player: get_caller_address(), ticketId, numbers });

            // Agregar el ticketId al array de tickets del usuario
            let mut userTickets = self.usertickets.read((get_caller_address(), drawId));
            userTickets.append(ticketId);
            self.usertickets.write((get_caller_address(), drawId), userTickets);
        }

        //OK
        fn DrawNumbers(ref self: ContractState, drawId: u64) {
            self.ownable.assert_only_owner();
            let mut draw = self.draws.read(drawId);
            assert(draw.isActive, 'Draw is not active');

            let winningNumbers = GenerateRandomNumbers();
            draw.winningNumbers = winningNumbers;
            draw.isActive = false;
            self.draws.write(drawId, draw);

            self
                .emit(
                    DrawCompleted {
                        drawId, winningNumbers, accumulatedPrize: draw.accumulatedPrize,
                    },
                );
        }

        //OK
        fn ClaimPrize(ref self: ContractState, drawId: u64, ticketId: felt252) {
            let draw = self.draws.read(drawId);
            let ticket = draw.tickets.read(ticketId);
            assert(!ticket.claimed, 'Prize already claimed');
            assert(!draw.isActive, 'Draw still active');

            let matches = self.CheckMatches(drawId, ticket.selectedNumbers);
            let prize = self.GetFixedPrize(matches);

            if prize > 0 {
                //TODO: We need to process the payment of the prize
                let mut ticket = ticket;
                ticket.claimed = true;
                draw.tickets.write(ticket_id, ticket);

                self
                    .emit(
                        PrizeClaimed {
                            draw_id, player: ticket.player, ticket_id, prize_amount: prize,
                        },
                    );
            }
        }

        //OK
        fn CheckMatches(self: @ContractState, drawId: u64, ticketNumbers: Array<felt252>) -> u8 {
            // Obtener el sorteo
            let draw = self.draws.read(drawId);
            assert(!draw.isActive, 'Draw must be completed');

            // Obtener los números ganadores
            let winningNumbers = draw.winningNumbers;
            assert(winningNumbers.len() > 0, 'No winning numbers');

            // Contador de coincidencias
            let mut matches: u8 = 0;

            // Para cada número del ticket
            let mut i: usize = 0;
            loop {
                if i >= ticketNumbers.len() {
                    break;
                }

                let ticketNumber = *ticketNumbers.at(i);

                // Buscar coincidencias con números ganadores
                let mut j: usize = 0;
                loop {
                    if j >= winningNumbers.len() {
                        break;
                    }

                    if ticketNumber == *winningNumbers.at(j) {
                        matches += 1;
                    }

                    j += 1;
                };

                i += 1;
            };

            matches
        }


        //OK
        fn GetAccumulatedPrize(self: @ContractState) -> u256 {
            self.accumulatedPrize
        }

        //OK
        fn GetFixedPrize(self: @ContractState, matches: u8) -> u256 {
            match matches {
                4 => self.fixedPrize4Matches.read(),
                3 => self.fixedPrize3Matches.read(),
                2 => self.fixedPrize2Matches.read(),
                _ => 0,
            }
        }

        //OK
        fn CreateNewDraw(ref self: ContractState, accumulatedPrize: u256) {
            let drawId = self.currentDrawId.read() + 1;
            let newDraw = Draw {
                drawId,
                accumulatedPrize: accumulatedPrize,
                winningNumbers: ArrayTrait::new(),
                tickets: Map::new(),
                isActive: true,
                startTime: get_block_timestamp(),
                endTime: get_block_timestamp() + 604800 // 1 Week
            };
            self.draws.write(drawId, newDraw);
            self.currentDrawId.write(drawId);
        }

        //OK
        fn GetDrawStatus(self: @ContractState, drawId: u64) -> bool {
            self.draws.read(drawId).isActive
        }

        fn GetUserTickets(self: @ContractState, drawId: u64) -> Array<felt252> {
            let draw = self.draws.read(drawId);
            let caller = get_caller_address();
            let mut userTickets = ArrayTrait::new();

            // Iterar sobre todos los tickets del sorteo
            let mut ticketId = 0;
            loop {
                if ticketId >= self.currentTicketId.read() {
                    break;
                }

                // Si el ticket existe y pertenece al usuario, agregarlo al array
                let ticket = draw.tickets.read(ticketId.into());
                if ticket.player == caller {
                    userTickets.append(ticketId.into());
                }

                ticketId += 1;
            };

            userTickets
        }

        fn GetTicketInfo(self: @ContractState, drawId: u64, ticketId: felt252) -> Ticket {
            let draw = self.draws.read(drawId);
            let ticket = draw.tickets.read(ticketId);
            // Verificar que el ticket pertenece al caller
            assert(ticket.player == get_caller_address(), 'Not ticket owner');
            ticket
        }
    }

    const MaxNumber: u16 = 99; // max number
    const RequiredNumbers: usize = 5; // amount of numbers per ticket

    #[generate_trait]
    impl InternalFunctions of InternalFunctionsTrait {
        //OK
        fn ValidateNumbers(self: @ContractState, numbers: @Array<u16>) -> bool {
            // Verify correct amount of numbers
            if numbers.len() != RequiredNumbers {
                return false;
            }

            // Verify that there are no duplicates and numbers are in range
            let mut usedNumbers: Felt252Dict<bool> = Default::default();
            let mut i: usize = 0;

            loop {
                if i >= numbers.len() {
                    break;
                }

                let number = *numbers.at(i);

                // Verify range (0-99)
                if number > MaxNumber {
                    return false;
                }

                // Verify duplicates
                if usedNumbers.contains(number.into()) {
                    return false;
                }

                usedNumbers.insert(number.into(), true);
                i += 1;
            };

            true
        }
    }

    //OK
    fn generateTicketId(ref self: ContractState) -> felt252 {
        let ticketId = self.currentTicketId.read() + 1;
        self.currentTicketId.write(ticketId);
        ticketId.into()
    }

    //OK
    fn GenerateRandomNumbers() -> Array<u16> {
        //TODO: We need to use VRF de Pragma Oracle to generate random numbers

        //now we are generating random numbers for testing
        let mut numbers = ArrayTrait::new();
        let blockTimestamp = get_block_timestamp();
        let blockHash = get_block_hash();

        //seed is the combination of the block timestamp and the block hash
        let seed = blockTimestamp + blockHash;

        //generate 4 unique numbers between 0-99
        let mut usedNumbers: Felt252Dict<bool> = Default::default();
        let mut count = 0;

        while count < 4 {
            let number = (seed + count) % 100;

            //check if the number is already used
            if !usedNumbers.contains(number) {
                numbers.append(number);
                usedNumbers.insert(number, true);
                count += 1;
            }
        }

        numbers
    }
}
