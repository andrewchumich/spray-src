/* @flow */
import { API_ROOT } from '../../config';
import type { Section } from './section';
import type { LineString, Position } from '../../utils'
var moment = require('moment');

export function getApiLineString(linestring: LineString) {
  let api_linestring = 'LINESTRING(';
  const coords = linestring.coordinates.reduce((prev, curr: Position, i, arr) => {
    const current_string = curr[0].toString() + ' ' + curr[1].toString;
    const end = (i < arr.length - 1) ? ', ' : '';
    return prev.concat(current_string + end);
  }, '')
}

export function mapSectionToApi(section: Section) {
  return {
    chemical_supplier: section.chemical_id,
    // TODO - user id
    // TODO - group id
    start: moment(section.startTime).toISOString(),
    end: moment(section.endTime).toISOString(),
    linestring: getApiLineString(section.line),
  };
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
  return fetch(API_ROOT, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(mapSectionToApi(options.section))
  }).then((response) => response.json());
}
