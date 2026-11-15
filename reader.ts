import {getImageFromImmich, isAssetInAlbum} from "./lib/ImageUtils.ts";
import fs from "node:fs";
import {Readable} from "node:stream";
import type ImmichImageData from './lib/ImmichImageData.ts'
import {logger} from './lib/logger.ts'



export async function downloadImagesInAlbum(assetIdsAndFilenames: ImmichImageData[],albumId: string | undefined):Promise<void>{

    if (!albumId) {
        logger.error('No albumId provided')
        throw new Error('Album id not provided.')
    }
    const saveLocation = process.env.PICTURE_FRAME_ALBUM_SAVE_LOCATION
    if (!albumId) {
        logger.error('No albumId provided')
        throw new Error('Album id not provided.')
    }

    logger.info("Photoframe Album ID: " + albumId);
    for (const imageData of assetIdsAndFilenames) {
        const assetId = imageData["id"]
        const filename = imageData["originalFileName"]
        const includeAsset: boolean = await isAssetInAlbum(albumId, assetId)

        if(includeAsset){
            const img = await getImageFromImmich(assetId);
            const destination = fs.createWriteStream(saveLocation + filename);
            Readable.fromWeb(img.body as any).pipe(destination);
        }

    }

};