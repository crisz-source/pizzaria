import multer from 'multer';
import crypto from 'crypto';

import {extname, resolve} from 'path';


//salvando as imagens cadastrada no sistema e colocando o destino de save e garantindo que o nome da imagem não se repita
export default {
  upload(folder: string){
    return{
      storage: multer.diskStorage({
        destination: resolve(__dirname, '..', '..', folder),
        filename: (request, file, callback) =>{

          const fileHash = crypto.randomBytes(16).toString("hex");
          const fileName = `${fileHash}-${file.originalname}`

          return callback(null, fileName)

        }
      })
    }


  }
}