import { toast } from "react-toastify";
import api from "../services/api";

interface LinkData {
  originalLink: string;
  shortLink: string;
  reset: () => void;
  isSubmitted: (data: boolean) => void;
}

export async function createLink({ originalLink, shortLink, reset, isSubmitted }: LinkData) {
  isSubmitted(true);

  try {
    await api.post('/links', {
      originalLink,
      shortLink
    }).then(() => {
      toast.success("Link criado com sucesso!");
      reset();
      isSubmitted(false);
    }).catch((error) => {
      toast.error(error.response.data.message);
      isSubmitted(false);
    });
  } catch (error) {
    console.log(error);
    toast.error('Ocorreu um erro ao criar o link, tente novamente mais tarde.');
    isSubmitted(false);
  }

}