import { toast } from "react-toastify";
import api from "../services/api";

interface ListLinksProps {
  addLinksAndTotalLinks: (data: ListLinksData) => void;
  setIsLoading: (data: boolean) => void
}

interface ListLinksData {
  links: {
    id: string;
    shortLink: string;
    originalLink: string;
    views: number;
  }[],
  totalLinks: number
}

export async function listLinks({ addLinksAndTotalLinks, setIsLoading }: ListLinksProps) {
  setIsLoading(true);
  try {
    await api.get('/links').then((response) => {
      addLinksAndTotalLinks(response.data);
      setIsLoading(false);
    }).catch((error) => {
      console.log(error);
      toast.error('Ocorreu um erro ao listar os links, tente novamente mais tarde.');
    })
  } catch (error) {
    console.log(error);
    toast.error('Sem conexão com o servidor, tente novamente mais tarde.');
  }
}