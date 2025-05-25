import { useCallback, useEffect, useState } from "react";
import { DownloadSimple, Link } from "@phosphor-icons/react";

import { Links } from "../Links";
import { listLinks } from "../../http/list-links";

import Button from "../ui/button";
import { exportLinks } from "../../http/export-links";
import { deleteLink } from "../../http/delete-link";

import { motion } from "motion/react";

interface CardLinksProps {
  reload?: boolean;
}

interface CardLinksResponse {
  links: {
    id: string;
    shortLink: string;
    originalLink: string;
    views: number;
  }[],
  totalLinks: number
}

export function CardLinks({ reload }: CardLinksProps) {

  const [links, setLinks] = useState<CardLinksResponse["links"]>([]);
  const [totalLinks, setTotalLinks] = useState<CardLinksResponse["totalLinks"]>(0);
  const [isLoading, setIsLoading] = useState(false);

  const addLinksAndTotalLinks = useCallback((data: CardLinksResponse) => {
    setLinks(data.links);
    setTotalLinks(data.totalLinks);
  }, []);

  const getLinks = useCallback(() => {
    listLinks({ addLinksAndTotalLinks, setIsLoading });
  }, [addLinksAndTotalLinks]);

  function downloadLinksReport() {
    exportLinks();
  }

  function deleteLinkByShortLink(shortLink: string) {

    const confirmar = window.confirm(`Tem certeza que deseja excluir esse link - ${shortLink}?`);

    if (confirmar) {
      deleteLink(shortLink, getLinks);
    } else {
      return;
    }
  }

  useEffect(() => {
    if (!reload) {
      getLinks();
    }
  }, [reload, getLinks]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        getLinks(); // Atualiza ao voltar para a aba
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [getLinks]);

  return (
    <div className="lg:col-span-6 col-span-3 flex flex-col gap-5 lg:p-8 p-6 bg-color-white rounded-lg lg:max-h-[600px] max-h-[355px]">
      {
        isLoading && (
          <div className="relative h-1 overflow-hidden lg:-mt-8 -mt-6 lg:-mx-6 -mx-4 rounded-full">
            <motion.div
              className="absolute top-0 left-0 h-full bg-color-blue-base rounded-full"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 1.5,
                ease: "easeInOut",
              }}
              style={{ width: "100%" }}
            />
          </div>
        )
      }
      <div className="flex flex-row justify-between items-center">
        <h1 className="text-lg font-bold">Meus links <span className="lg:text-lg lg:font-bold lg:inline-block hidden">{totalLinks > 0 && `(${totalLinks})`}</span></h1>
        <Button variant="default" className="h-[32px] text-xs" onClick={downloadLinksReport}><DownloadSimple className="w-5 h-5 mr-2" weight="bold" />Baixar CSV</Button>
      </div>
      <div className="flex-1 flex-col border-t-1 border-color-gray-200 justify-center items-center gap-3 pt-0 pb-6 overflow-y-auto">
        {
          links.length > 0 ?
            links.map((link) => {
              return (
                <Links key={link.id} shortLink={link.shortLink} originalLink={link.originalLink} views={link.views} deleteLinkByShortLink={deleteLinkByShortLink} />
              )
            })
            :
            (
              <div className="flex flex-col items-center gap-2 lg:pt-9 pt-8">
                <Link className="w-8 h-8" weight="bold" />
                <span className="lg:text-lg text-xxs font-normal uppercase ">Ainda não existem links cadastrados</span>
              </div>
            )
        }
      </div>
    </div>
  )
}