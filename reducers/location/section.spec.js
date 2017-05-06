import { Section, SectionConfig } from './section';
import { LineString, Point } from '../../utils';
import { BoomOrientation } from '../spray';

test('Section Class should throw error with no chemical id', () => {
    const section_config: SectionConfig = {
        startTime: new Date(),
        endTime: new Date(),
        county_id: 0,
        boom: 'BOTH',
        user_id: 0,
        group_id: 1,
    };

    expect(() => {
        let s = new Section(section_config);
    }).toThrow(TypeError);
});

test('Section Class should throw error with no county id', () => {
    const section_config: SectionConfig = {
        startTime: new Date(),
        endTime: new Date(),
        chemical_id: 0,
        boom: 'BOTH',
        user_id: 0,
        group_id: 1,
    };

    expect(() => {
        let s = new Section(section_config);
    }).toThrow(TypeError);
});

test('Section Class should throw error with no county id', () => {
    const section_config: SectionConfig = {
        startTime: new Date(),
        endTime: new Date(),
        chemical_id: 0,
        county_id: 0,
        user_id: 0,
        group_id: 1,
    };

    expect(() => {
        let s = new Section(section_config);
    }).toThrow(TypeError);
});

test('Section Class should not throw error on good config', () => {
    const section_config: SectionConfig = {
        startTime: new Date(),
        endTime: new Date(),
        chemical_id: 0,
        chemical_flow: 0,
        county_id: 0,
        weed_ids: [],
        boom: 'BOTH',
        boom_size: 0,
        user_id: 0,
        group_id: 1,
    };

    expect(() => {
        let s = new Section(section_config);
    }).not.toThrow();
});

test('Section Class should be able to set end time', () => {
    const section_config: SectionConfig = {
        startTime: new Date(),
        chemical_id: 0,
        chemical_flow: 0,
        county_id: 0,
        weed_ids: [],
        boom: 'BOTH',
        boom_size: 0,
        user_id: 0,
        group_id: 1,
    };

    let s = new Section(section_config);
    expect(s.endTime).toBe(null);

    const end_time = new Date();
    s.setEndTime(end_time);
    expect(s.endTime).toBe(end_time);
});

test('Section Class should be able to add position', () => {
    const section_config: SectionConfig = {
        startTime: new Date(),
        endTime: new Date(),
        chemical_id: 0,
        chemical_flow: 0,
        county_id: 0,
        weed_ids: [],
        boom: 'BOTH',
        boom_size: 0,
        user_id: 0,
        group_id: 1,
    };

    let s = new Section(section_config);
    expect(s.line.coordinates.length).toBe(0);
    const p: Position = [0, 2, 1000];

    s.addPosition(p);
    expect(s.line.coordinates.length).toBe(1);

});

test('Section Class should generate uuid', () => {
    const section_config: SectionConfig = {
        startTime: new Date(),
        chemical_id: 0,
        chemical_flow: 0,
        county_id: 0,
        weed_ids: [],
        boom: 'BOTH',
        boom_size: 0,
        user_id: 0,
        group_id: 1,
    };

    let s = new Section(section_config);
    expect(s.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
});
