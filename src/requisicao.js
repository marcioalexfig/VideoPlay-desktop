import base from './base';
const cheerio = require('cheerio');

const PATH = '/new';

/** parseVideo */
const parseVideo = ($, video) => {
    const $video = $(video);
  
    const title = $video.find('p:not(".metadata") a').attr('title');
    const path = $video.find('.thumb > a').attr('href');
    const url = `${base.BASE_URL}${path}`;
    const views = $video.find('p.metadata > span > span:not(.duration)').text();
    const duration = $video.find('p.metadata > span.bg > span.duration').text();
    const profileElement = $video.find('p.metadata > span > a');
    const profile = {
      name: profileElement.text(),
      url: `${base.BASE_URL}${profileElement.attr('href')}`,
    };
  
    return {
      url,
      path,
      title,
      duration,
      profile,
      views,
    };
};

/** getVideos */
const getVideos = ($) => {
    return $('#content > .mozaique > .thumb-block')
    .map((i, video) => parseVideo($, video))
    .get();
};

/** getPages */
const getPages = ($) => {
    return $('.pagination > ul > li > a')
    .map((i, page) => $(page)
    .text())
    .filter((i, page) => !isNaN(page))
    .map((i, page) => Number(page) - 1)
    .get();
};

/** parseResponse */
function parseResponse (page, { data }) {
    const $ = cheerio.load(data);

    const videos = getVideos($);

    const pagination = {
        page,
        pages: getPages($),
    };

    return {
        videos,
        pagination
    };
};

/** fresh */
const requisicao = async ({ page = 1 } = {}) => {
  if (page < 1 || page > Number.MAX_SAFE_INTEGER) {
    throw new Error(`Invalid page: ${page}`);
  }

  const request = base.createRequest({
    url: `${PATH}/${page}`,
  });

  return parseResponse(page, await request.get());
};

export default requisicao;
