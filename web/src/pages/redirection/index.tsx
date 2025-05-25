import { useEffect } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { getShortLinkAndReturnOriginalLink } from "../../http/get-short-link-and-return-original-link";

import Icon from "../../assets/Logo_Icon.svg";

export function Redirection() {

  const { shortLink } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    if(shortLink){
      getShortLinkAndReturnOriginalLink(shortLink, navigate);  
    }
  }, [shortLink, navigate]);

  return(
    <div className="flex flex-col h-full lg:w-[1180px] md:w-full w-[300px] lg:gap-8 gap-6 items-center justify-center ">
      <div className="flex flex-col gap-6 max-w-[580px] max-h-[296px] justify-center items-center lg:py-16 lg:px-12 px-5 py-12 bg-color-white rounded-lg">
        <img src={Icon} alt="Logo" className="w-[48px] h-[48px]" />
        <h1 className="text-2xl font-bold text-color-gray-600">Redirecionando...</h1>
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm lg:text-base font-semibold text-color-gray-500 text-center">O link será aberto automaticamente em alguns instantes. </p>
          <p className="text-sm lg:text-base font-semibold text-color-gray-500"> Não foi redirecionado? <NavLink to="/" className="text-color-blue-base font-semibold underline">Acesse aqui</NavLink></p>
        </div>
      </div>
    </div>
  )
}