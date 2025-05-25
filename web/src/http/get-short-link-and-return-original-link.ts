import type { NavigateFunction } from "react-router-dom";
import api from "../services/api";
import { updateViewsLink } from "./update-views-link";


export async function getShortLinkAndReturnOriginalLink(shortLink: string, navigate: NavigateFunction) {
  try {
    await api.get(`/links/${shortLink}`).then(async (response) => {
      const originalLink = response.data.originalLink;

      if (originalLink) {
        return await updateViewsLink(shortLink, originalLink);
      }

    }).catch((error) => {
      console.log(error);
      return navigate('/url/not-found');
    })
  } catch (error) {
    console.log(error);
    return navigate('/url/not-found');
  }
}