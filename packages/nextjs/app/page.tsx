import Header from "./_components/Header";
import HotDeal from "./_components/HotDeal";



const Home = () => {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <Header />
        <HotDeal />
      </div>
    </div>
  );
};

export default Home;
