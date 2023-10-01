import { it } from "vitest";
import { describe, expect } from "vitest";
import { IncomingMessage, ServerResponse } from 'http';
import fuset from './index';



describe('Redirecting', () => {

  it("should return test1.js and test2.js combined", () => {

    const fusetOptions = {
      path: './test',
      cache: 'no-store',
      mime: 'javascript/text',
    }

    const fusetHandler = fuset(fusetOptions)

    let cacheControl: string = ''
    let contentType: string = ''
    
    const req = Object.create(IncomingMessage.prototype)
    req.url = 'http://localhost:3000/test.js'
    req.path = '/test.css'

    const res = Object.create(ServerResponse.prototype)
    res.header = (name: string, value: string) => {
      console.log("HEADER", name, value)
      if (name == 'Cache-Control') {
        cacheControl = value
      }
      if (name == 'Content-Type') {
        contentType = value
      }
    }
    res.send = (data: string) => {
      expect(cacheControl).toBe(fusetOptions.cache);
      expect(contentType).toBe('javascript/text; charset=utf-8');
      expect(data).toBe(`console.log('TEST 1');\nconsole.log('TEST 2');`);
    }
    const next = (err?: any) => {
      expect(true).toBe(false);
    }
    fusetHandler(req, res, next)
  });

  it("should return test1.js", () => {

    const fusetOptions = {
      path: './test',
      files: ['test1.js'],
      cache: 'no-store',
      mime: 'javascript/text',
    }
    
    const fusetHandler = fuset(fusetOptions)

    let cacheControl: string = ''
    let contentType: string = ''
    
    const req = Object.create(IncomingMessage.prototype)
    req.url = 'http://localhost:3000/test.js'
    req.path = '/test.css'

    const res = Object.create(ServerResponse.prototype)
    res.header = (name: string, value: string) => {
      console.log("HEADER", name, value)
      if (name == 'Cache-Control') {
        cacheControl = value
      }
      if (name == 'Content-Type') {
        contentType = value
      }
    }
    res.send = (data: string) => {
      expect(cacheControl).toBe(fusetOptions.cache);
      expect(contentType).toBe('javascript/text; charset=utf-8');
      expect(data).toBe(`console.log('TEST 1');`);
    }
    const next = (err?: any) => {
      expect(true).toBe(false);
    }
    fusetHandler(req, res, next)
  });

});
