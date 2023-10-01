import { join, extname } from 'path';
import { readFileSync, readdirSync, existsSync } from 'fs';
import mime from 'mime';

const DEFAULT_ENCODING = 'utf-8';


interface FusetNext {
  (err?: any): void;
}

interface FusetOptions {
  path?: string,
  files?: string[],
  cache?: string,
  mime?: string,
}


interface FusetRequest {
  url: string,
  originalUrl: string,
  path: string,
}

interface FusetResponse {
  statusCode: number,
  header: { (name: string, value: string): void },
  send: { (data: string|number|boolean|object|Buffer): void },
}



function getFileList(path?: string, files?: string[]) {
  const fileList = [];
  if (path) {
    if (files) {
      for(let filename of files) {
        fileList.push(join(path, filename));
      }
    } else {
      // get all files in folder
      const dirlist = readdirSync(path)
      for(let filename of dirlist) {
        fileList.push(join(path, filename));
      }
    }
  } else if (files) {
    fileList.push(...files)
  }
  return fileList;
}


function combineFileContents(files: string[], delimiter?: string): string {
  const contents: string[] = []
  for(let file of files) {
    if (!existsSync(file)) throw Error(`The file ${file} does not exist.`)
    const content = readFileSync(file, DEFAULT_ENCODING);
    contents.push(content);
  }
  if (delimiter !== undefined)
    return contents.join(delimiter);
  else
    return contents.join('\n\n');
}




function fuset(options: FusetOptions) {

  if (!options.path && !options.files) throw new Error('A path or file array is required.')

  const optCache = options.cache;
  const optMime = options.mime;
  const fileList = getFileList(options.path, options.files);
  const content = combineFileContents(fileList, '\n');

  const fusetHandler = (req: FusetRequest, res: FusetResponse, next: FusetNext) => {
    if (optCache) res.header('Cache-Control', optCache);
    if (optMime) {
      res.header('Content-Type', `${optMime}; charset=${DEFAULT_ENCODING}`);
    } else {
      // get file ext from url
      const ext = extname(req.path)
      if (ext) {
        const type = mime.getType(ext.slice(1));
        if (type) res.header('Content-Type', `${optMime}; charset=${DEFAULT_ENCODING}`);
      }
    }
    res.statusCode = 200;
    res.send(content);
  }

  return fusetHandler;
}

export = fuset;