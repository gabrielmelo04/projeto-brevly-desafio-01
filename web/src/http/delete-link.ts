import { toast } from "react-toastify";
import api from "../services/api";


export async function deleteLink(shortLink: string, getLinks: () => void) {
  try {
    await api.delete(`/links/delete/${shortLink}`).then(() => {
      toast.success("Link excluido com sucesso!");
      getLinks();
    }).catch((error) => {
      toast.error(error.response.data.message);
    })
  } catch (error) {
    console.log(error);
  }
}