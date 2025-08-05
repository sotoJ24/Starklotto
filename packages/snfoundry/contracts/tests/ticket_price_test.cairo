use contracts::Lottery::{ILotteryDispatcher, ILotteryDispatcherTrait};
use snforge_std::{ContractClassTrait, DeclareResultTrait, declare, start_cheat_caller_address, stop_cheat_caller_address};
use starknet::ContractAddress;

// Test addresses
fn OWNER() -> ContractAddress {
    'OWNER'.try_into().unwrap()
}

fn USER() -> ContractAddress {
    'USER'.try_into().unwrap()
}

fn ADMIN() -> ContractAddress {
    'ADMIN'.try_into().unwrap()
}

// Helper function to deploy the Lottery contract
fn deploy_lottery() -> ContractAddress {
    let mut constructor_calldata = array![];
    OWNER().serialize(ref constructor_calldata);
    
    let lottery_class = declare("Lottery").unwrap().contract_class();
    let (lottery_addr, _) = lottery_class.deploy(@constructor_calldata).unwrap();
    
    lottery_addr
}

#[test]
fn test_initial_ticket_price() {
    let lottery_addr = deploy_lottery();
    let lottery_dispatcher = ILotteryDispatcher { contract_address: lottery_addr };
    
    // Initially, ticket price should be 0 (not set)
    let initial_price = lottery_dispatcher.GetTicketPrice();
    assert!(initial_price == 0, "Initial ticket price should be 0");
}

#[test]
fn test_set_ticket_price_by_owner() {
    let lottery_addr = deploy_lottery();
    let lottery_dispatcher = ILotteryDispatcher { contract_address: lottery_addr };
    
    // Set caller as owner
    start_cheat_caller_address(lottery_dispatcher.contract_address, OWNER());
    
    // Set ticket price
    let new_price: u256 = 1000000000000000000; // 1 token (18 decimals)
    lottery_dispatcher.SetTicketPrice(new_price);
    
    // Verify the price was set correctly
    let current_price = lottery_dispatcher.GetTicketPrice();
    assert!(current_price == new_price, "Ticket price was not set correctly");
    
    stop_cheat_caller_address(lottery_dispatcher.contract_address);
}

#[test]
fn test_set_ticket_price_multiple_times() {
    let lottery_addr = deploy_lottery();
    let lottery_dispatcher = ILotteryDispatcher { contract_address: lottery_addr };
    
    // Set caller as owner
    start_cheat_caller_address(lottery_dispatcher.contract_address, OWNER());
    
    // Set initial price
    let initial_price: u256 = 1000000000000000000;
    lottery_dispatcher.SetTicketPrice(initial_price);
    assert!(lottery_dispatcher.GetTicketPrice() == initial_price, "Initial price not set correctly");
    
    // Update price
    let updated_price: u256 = 2000000000000000000;
    lottery_dispatcher.SetTicketPrice(updated_price);
    assert!(lottery_dispatcher.GetTicketPrice() == updated_price, "Updated price not set correctly");
    
    // Update price again
    let final_price: u256 = 500000000000000000;
    lottery_dispatcher.SetTicketPrice(final_price);
    assert!(lottery_dispatcher.GetTicketPrice() == final_price, "Final price not set correctly");
    
    stop_cheat_caller_address(lottery_dispatcher.contract_address);
}

#[test]
fn test_set_ticket_price_to_zero() {
    let lottery_addr = deploy_lottery();
    let lottery_dispatcher = ILotteryDispatcher { contract_address: lottery_addr };
    
    // Set caller as owner
    start_cheat_caller_address(lottery_dispatcher.contract_address, OWNER());
    
    // Set price to zero
    lottery_dispatcher.SetTicketPrice(0);
    assert!(lottery_dispatcher.GetTicketPrice() == 0, "Zero price not set correctly");
    
    stop_cheat_caller_address(lottery_dispatcher.contract_address);
}

#[test]
fn test_set_ticket_price_very_high_value() {
    let lottery_addr = deploy_lottery();
    let lottery_dispatcher = ILotteryDispatcher { contract_address: lottery_addr };
    
    // Set caller as owner
    start_cheat_caller_address(lottery_dispatcher.contract_address, OWNER());
    
    // Set a very high price
    let high_price: u256 = 1000000000000000000000000000; // 1 million tokens
    lottery_dispatcher.SetTicketPrice(high_price);
    assert!(lottery_dispatcher.GetTicketPrice() == high_price, "High price not set correctly");
    
    stop_cheat_caller_address(lottery_dispatcher.contract_address);
}

#[test]
fn test_get_ticket_price_public_access() {
    let lottery_addr = deploy_lottery();
    let lottery_dispatcher = ILotteryDispatcher { contract_address: lottery_addr };
    
    // Set caller as owner to set price
    start_cheat_caller_address(lottery_dispatcher.contract_address, OWNER());
    let set_price: u256 = 1500000000000000000;
    lottery_dispatcher.SetTicketPrice(set_price);
    stop_cheat_caller_address(lottery_dispatcher.contract_address);
    
    // Test that any user can read the ticket price
    start_cheat_caller_address(lottery_dispatcher.contract_address, USER());
    let read_price = lottery_dispatcher.GetTicketPrice();
    assert!(read_price == set_price, "User cannot read ticket price correctly");
    stop_cheat_caller_address(lottery_dispatcher.contract_address);
    
    // Test with another user
    start_cheat_caller_address(lottery_dispatcher.contract_address, ADMIN());
    let read_price_2 = lottery_dispatcher.GetTicketPrice();
    assert!(read_price_2 == set_price, "Admin cannot read ticket price correctly");
    stop_cheat_caller_address(lottery_dispatcher.contract_address);
}

#[test]
fn test_ticket_price_persistence() {
    let lottery_addr = deploy_lottery();
    let lottery_dispatcher = ILotteryDispatcher { contract_address: lottery_addr };
    
    // Set caller as owner
    start_cheat_caller_address(lottery_dispatcher.contract_address, OWNER());
    
    // Set initial price
    let initial_price: u256 = 1000000000000000000;
    lottery_dispatcher.SetTicketPrice(initial_price);
    
    // Verify price persists
    assert!(lottery_dispatcher.GetTicketPrice() == initial_price, "Price not persisted after setting");
    
    // Change caller and verify price still persists
    stop_cheat_caller_address(lottery_dispatcher.contract_address);
    start_cheat_caller_address(lottery_dispatcher.contract_address, USER());
    assert!(lottery_dispatcher.GetTicketPrice() == initial_price, "Price not persisted after caller change");
    
    stop_cheat_caller_address(lottery_dispatcher.contract_address);
}

#[test]
fn test_ticket_price_with_initialize() {
    let lottery_addr = deploy_lottery();
    let lottery_dispatcher = ILotteryDispatcher { contract_address: lottery_addr };
    
    // Set caller as owner
    start_cheat_caller_address(lottery_dispatcher.contract_address, OWNER());
    
    // Initialize with a specific ticket price
    let init_price: u256 = 500000000000000000;
    let accumulated_prize: u256 = 10000000000000000000;
    lottery_dispatcher.Initialize(init_price, accumulated_prize);
    
    // Verify the ticket price was set during initialization
    assert!(lottery_dispatcher.GetTicketPrice() == init_price, "Ticket price not set during initialization");
    
    // Update the price after initialization
    let new_price: u256 = 750000000000000000;
    lottery_dispatcher.SetTicketPrice(new_price);
    assert!(lottery_dispatcher.GetTicketPrice() == new_price, "Price not updated after initialization");
    
    stop_cheat_caller_address(lottery_dispatcher.contract_address);
}

#[test]
fn test_ticket_price_edge_cases() {
    let lottery_addr = deploy_lottery();
    let lottery_dispatcher = ILotteryDispatcher { contract_address: lottery_addr };
    
    // Set caller as owner
    start_cheat_caller_address(lottery_dispatcher.contract_address, OWNER());
    
    // Test with minimum value (1 wei)
    let min_price: u256 = 1;
    lottery_dispatcher.SetTicketPrice(min_price);
    assert!(lottery_dispatcher.GetTicketPrice() == min_price, "Minimum price not set correctly");
    
    // Test with maximum u256 value
    let max_price: u256 = 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff;
    lottery_dispatcher.SetTicketPrice(max_price);
    assert!(lottery_dispatcher.GetTicketPrice() == max_price, "Maximum price not set correctly");
    
    stop_cheat_caller_address(lottery_dispatcher.contract_address);
} 