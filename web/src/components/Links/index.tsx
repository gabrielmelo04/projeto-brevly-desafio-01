import { Copy, Trash } from "@phosphor-icons/react";
import Button from "../ui/button";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";

interface LinksProps {
  shortLink: string;
  originalLink: string;
  views: number;
  deleteLinkByShortLink: (shortLink: string) => void
}

export function Links({ shortLink, originalLink, views, deleteLinkByShortLink }: LinksProps) {

  function copyLinkToClipboard(shortLink: string) {
    navigator.clipboard.writeText(`http://localhost:5173/${shortLink}`);

    toast.success(`Link copiado com sucesso! \nO link ${shortLink} foi copiado para a area de transferencia!`);
  }


  return (
    <>
      <div className="flex flex-row justify-between items-center w-full gap-4 py-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-sm text-color-blue-base font-semibold truncate lg:w-[200px] w-[100px]" title={shortLink}><NavLink to={`/${shortLink}`} target="_blank">brev.ly/{shortLink}</NavLink></h1>
          <p className="text-xs text-color-gray-500 truncate lg:w-[200px] w-[100px]" title={originalLink}>{originalLink}</p>
        </div>
        <div className="flex flex-row lg:gap-5 gap-3 items-center">
          <p className="text-color-gray-500 text-xs">{views} acessos</p>
          <div className="flex flex-row gap-1">
            <Button variant="defaultIcon" className="lg:h-[42px] lg:w-auto h-[32px] w-[32px] px-0 py-0" onClick={() => copyLinkToClipboard(shortLink)}><Copy className="lg:w-5 lg:h-5 w-3 h-3" weight="bold" /></Button>
            <Button variant="defaultIcon" className="px-0 py-0 lg:h-[42px] lg:w-auto h-[32px] w-[32px]" onClick={() => deleteLinkByShortLink(shortLink)}><Trash className="lg:w-5 lg:h-5 w-3 h-3" weight="bold" /></Button>
          </div>
        </div>
      </div>
      <hr className="w-full border-t-1 border-color-gray-200" />
    </>
  )
}