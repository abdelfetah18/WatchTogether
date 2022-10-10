import * as yt from 'youtube-search-without-api-key';

export default async function handler(req, res) {
    var { q } = req.query;
    const videos = await yt.search(q);
    res.status(200).json({ status:"success", total_videos: videos.length, videos });
}
  