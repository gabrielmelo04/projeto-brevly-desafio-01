import { toast } from "react-toastify";
import api from "../services/api";

export async function exportLinks() {
  try {
    await api.post('/links/uploads/export').then((response) => {

      const fileUrl = response.data.message;

      const link = document.createElement('a');
      link.href = fileUrl;
      link.setAttribute('download', 'links.csv');

      document.body.appendChild(link);
      link.click();

    }).catch((error) => {
      toast.error('Não foi possível baixar o arquivo, tente novamente mais tarde.');
      console.log(error);
    })

  } catch (error) {
    console.log(error);
  }
}