import 'dotenv/config';
import {getDataOnRecentlyUploadedAssets} from "./lib/ImageUtils.ts";
import type ImmichImageData from "./lib/ImmichImageData.ts";
import {DateTime} from 'luxon'
import {downloadImagesInAlbum} from './reader.ts'

export async function job(): Promise<void> {

    const lastPulledDate: DateTime = DateTime.fromFormat("2026-11-01", "yyyy-MM-dd")
    const recentlyUploadedAssetsData: ImmichImageData[] = await getDataOnRecentlyUploadedAssets(lastPulledDate);
    const albumId: string | undefined = process.env.PICTURE_FRAME_ALBUM_ID
    await downloadImagesInAlbum(recentlyUploadedAssetsData,albumId);

}


