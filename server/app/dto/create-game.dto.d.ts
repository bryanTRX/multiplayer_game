import { Tile } from '@common/interfaces';
export declare class CreateGameDto {
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
