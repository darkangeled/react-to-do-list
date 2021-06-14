import { Header } from "./Elementos";
import "../../sass/styles.scss";

const Lista = (props) => {
  return (
    <>
      <nav className="panel">
        <Header></Header>
        {props.children}
      </nav>
    </>
  );
};

export default Lista;
