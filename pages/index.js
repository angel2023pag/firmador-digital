import Head from "next/head";
import EmblaCarousel from "../components/EmblaCarousel";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center  py-2 overflow-x-hidden">
   
    </div>
  );
};

Home.layout = "L2";
{
  /* Solo es necesario poner el nombre del componente, seguido de .layout = "L2" si se requiere seleccionar el segundo layout (Layout2)
    layout.js es el layout por defecto y no es necesario marcarlo explicitamente. 
*/
}
export default Home;
