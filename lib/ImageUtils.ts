import {logger} from './logger.ts'
import {DateTime} from 'luxon'
import type ImmichImageData from './ImmichImageData.ts'

const baseURL: string | undefined = process.env.IMMICH_SERVER_URL;
const key: string | undefined = process.env.IMMICH_API_KEY


export async function getImageFromImmich(id: string): Promise<globalThis.Response> {
    //e41ec084-02fb-4654-8423-667813c5988a
    //3164fe25-0814-416b-98bd-c3511156e00f
    if (!key){
        logger.error('No API key provided.')
        throw new Error('No API key provided.')
    }


    if (!baseURL){
        logger.error('No baseURL provided.')
        throw new Error('Base URL of image server not provided.')
    }


    return await fetch(baseURL+"/api/assets/" + id + "/original", {
        method: "GET",
        headers: {
            "x-api-key": key
        }
    });
}

export async function isAssetInAlbum( albumId: string,  assetId: string):Promise<boolean>{

    if (!key){
        logger.error("No API key provided.")
        throw new Error('No API key provided.')
    }


    if (!baseURL){
        logger.error("Base URL of image server not provided.")
        throw new Error('Base URL of image server not provided.')
    }

    let result: boolean = false;
    await fetch(baseURL+"/api/albums?assetId=" + assetId, {
        method: "GET",
        headers: {
            "x-api-key": key,
            'Content-Type': 'application/json'
        }
    }).then(async (imageResponse: Response):Promise<boolean> => {

            if (imageResponse.body) {

                let listOfAlbumsMetaData = await imageResponse.json();

                if (Object.keys(listOfAlbumsMetaData).length != 0) {

                    listOfAlbumsMetaData.forEach((metaData:any) => {
                        if (metaData['id'] == albumId) {
                            result = true;
                            return;
                        }
                    });
                }

            }
        return result;
        }

    )
    return result;


}

export async function getDataOnRecentlyUploadedAssets( lastUpdatedDate: DateTime ) {

    const key: string | undefined = process.env.IMMICH_API_KEY

    if (!key) {
        logger.error("No API key provided.")
        throw new Error('No API key provided.')
    }

    const baseURL: string | undefined = process.env.IMMICH_SERVER_URL;
    if (!baseURL) {
        logger.error("Base URL of image server not provided.")
        throw new Error('Base URL of image server not provided.')
    }



    const isoLastUpdatedData = lastUpdatedDate.toISO();
    logger.info("LastUpdatedData:", isoLastUpdatedData);



    const searchCriteria = {
        "filter": {
            "updatedAt": {"gte": isoLastUpdatedData},
            "trashedAt": {"eq": null}
        }
    }


    let recentlyUploadedAssets: ImmichImageData[] = []
    await fetch(baseURL + "/api/search/metadata", {
        method: "POST",
        headers: {
            "x-api-key": key,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(searchCriteria)
    }).then(async (imageResponse) => {

        if (imageResponse.body) {
            let metaData = await imageResponse.json();
            metaData.assets.items.forEach((asset: ImmichImageData) => {
                logger.info("asset found, id: "+ asset.id);
                logger.info("asset found, originalFileName: " +  asset.originalFileName);
                const data = {"id": asset.id, "originalFileName": asset.originalFileName};
                recentlyUploadedAssets.push(data);
            })

        }
    });
    return recentlyUploadedAssets;


}







