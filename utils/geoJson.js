/* @flow */
// type definitions for position types according to GeoJSON Specification: RFC 7946

/**
 * [longitude, latitude, altitude]
 */
export type Position = [number, number, number];

export interface Point {
    coordinates: Position,
};

export interface MultiPoint {
    coordinates: Position[],
};

export interface LineString {
    /**
     * Must have 2 or more positions
     */
    coordinates: Position[],
};

export interface MultiLineString {
    coordinates: LineString[],
};

export interface LinearRing {
    /**
     * Must have 4 or more positions with the first and last being the same
     */
    coordinates: LineString,
};

export interface Polygon {
    coordinates: LinearRing[],
};

export interface MultiPolygon {
    coordinates: Polygon[],
};

export interface GeometryObject {
    coordinates: Point
        | MultiPoint
        | LineString
        | MultiLineString
        | Polygon
        | MultiPolygon
}
