import { NavLink } from "react-router-dom";
import Icon from "../../assets/404.svg";

export function NotFound() {
  return (
    <div className="flex flex-col h-full lg:w-[1180px] md:w-full w-[300px] lg:gap-8 gap-6 items-center justify-center ">
      <div className="flex flex-col gap-6 max-w-[580px] max-h-[296px] justify-center items-center lg:py-16 lg:px-12 px-5 py-12 bg-color-white rounded-lg">
        <img src={Icon} alt="Logo" className="w-[194px] h-[85px]" />
        <h1 className="text-2xl font-bold text-color-gray-600">Link não encontrado</h1>
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm lg:text-base font-semibold text-color-gray-500 text-center">O link que você está tentando acessar não existe, foi removido ou é uma URL inválida. Saiba mais em <NavLink to="/" className="text-color-blue-base font-semibold underline">brev.ly</NavLink> </p>
        </div>
      </div>
    </div>
  )
}