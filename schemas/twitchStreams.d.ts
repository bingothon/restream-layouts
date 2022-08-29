/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type TwitchStreams = {
  channel: string;
  widthPercent: number & string;
  heightPercent: number & string;
  topPercent: number & string;
  leftPercent: number & string;
  quality: string;
  volume: number & string;
  paused: boolean & string;
  delay: number;
  availableQualities: {
    name: string;
    group: string;
  }[];
}[];
