import api from "../services/api";

export async function updateViewsLink(shortLink: string, originalLink: string) {
  try {
    await api.put(`/links/update-views/${shortLink}`).then(() => {

      if (originalLink.startsWith('www.')) {
        window.location.href = `https://${originalLink}`;
      } else {
        window.location.href = originalLink;
      }
    }).catch((error) => {
      console.log(error);
    })
  } catch (error) {
    console.log(error);
  }
}