import { Tile } from '@common/interfaces';
import { Document } from 'mongoose';
export type GameDocument = Game & Document;
export declare class Game {
    id: string;
    description: string;
    name: string;
    size: string;
    gameMode: string;
    visibility: boolean;
    map: Tile[];
    map2: Tile[];
    modificationDate: string;
    screenshot: string;
}
export declare const gameSchema: import("mongoose").Schema<Game, import("mongoose").Model<Game, any, any, any, Document<unknown, any, Game> & Game & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Game, Document<unknown, {}, import("mongoose").FlatRecord<Game>> & import("mongoose").FlatRecord<Game> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
