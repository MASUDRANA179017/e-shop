
import Container from "../commonLayouts/Container";
import TopLeftComponent from "./headerComponent/TopLeftComponent";
import TopRIghtComponent from "./headerComponent/TopRIghtComponent";
const TopBar = () => {
  return (
    <div className="border border-gray-500">
      <Container>
        <div className="flex justify-between items-center py-2 ">
          <TopLeftComponent />
          <TopRIghtComponent />
        </div>
      </Container>
    </div>
  );
};

export default TopBar;
