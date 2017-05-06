/* @flow */
import { API_ROOT } from '../../config';
import type { Section } from './section';
import type { LineString, Position } from '../../utils'
import { OAuth2 } from '../../utils';
import type { Token } from '../../utils';
var moment = require('moment');

export function getApiLineString(linestring: LineString) {
  let api_linestring = 'LINESTRING(';
  const coords = linestring.coordinates.reduce((prev, curr: Position, i, arr) => {
    const current_string = curr[0].toString() + ' ' + curr[1].toString();
    const end = (i < arr.length - 1) ? ', ' : ')';
    return prev.concat(current_string + end);
  }, api_linestring);
  return coords;
}

export function mapSectionToApi(section: Section) {
  const s = {
    chemical_supplier: section.chemical_id,
    weeds: section.weed_ids,
    // TODO - user id
    // TODO - group id
    start: moment(section.startTime).toISOString(),
    end: moment(section.endTime).toISOString(),
    linestring: getApiLineString(section.line),
  };
  return s;
};

export const LocationService = {
  get,
  save,
}

function get(options: any) {
  return fetch(API_ROOT)
    .then((response) => response.json());
}

export type SaveOptions = {
  section: Section,
};

function save(options: SaveOptions) {
  const URL = API_ROOT + '/spraysections';
  return OAuth2.getToken().then((t: Token) => {
    const post_data = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + t.access_token,
      },
      body: JSON.stringify(mapSectionToApi(options.section))
    };
    console.log(post_data);
    return fetch(URL, post_data).then((response) => response.json());
  });
}
