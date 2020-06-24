import React from 'react';
import { PermissionsAndroid } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';

class Storage {
    constructor() {
        this.fs = RNFetchBlob.fs.ls(RNFetchBlob.fs.dirs.DCIMDir+'/Camera').then((files) => {
            this._setFs(files);
               
        });
        this.dataFs = RNFetchBlob.fs.ls(RNFetchBlob.fs.dirs.SDCardDir+'/DataGalery').then((files) => {
            this.setDataFs(files);
        });
        this.fileExists = false;
    }

    getFileExists() {
        return this.fileExists;
    }

    getFs() {
        return this.fs;
    }

    getDataFs(){
        return this.dataFs;
    }

    _setFs(fs) {
        this.fs = fs;
    }

    setDataFs(fs) {
        this.dataFs = fs;
    }
    
    setFileExists(fs) {
        this.fileExists = fs;
    }

    async createObject(array = Array) {
        let obj = {'files': []};
        for(let i=0;i<array.length;i++){
            obj['files'][obj['files'].length] = {"file": array[i]};
        }
        return obj;
    }
    
    async listFilesInDataGalery() {
        await RNFetchBlob.fs.ls(RNFetchBlob.fs.dirs.SDCardDir+"/DataGalery").then((files) => {
            this.setDataFs(files);
        });    
        const response = await this.createObject(this.getDataFs());
        return response["files"];
    }

    async listFilesInCamera() {
        await RNFetchBlob.fs.ls(RNFetchBlob.fs.dirs.DCIMDir+'/Camera').then((files) => {
            this._setFs(files); 
        });
        const response = await this.createObject(this.getFs())
        return response["files"];
    }

    createFolder(){
        RNFetchBlob.fs.mkdir(RNFetchBlob.fs.dirs.SDCardDir+"/DataGalery").then(res => {
            
        });
    }

    async createFile(name){
        let trueOrFalse = false;
        
        if(name == '') {
            return false;
        } else {
            let obj = {};
            let nameLower = name.toLowerCase();
        
            await RNFetchBlob.fs.writeFile(RNFetchBlob.fs.dirs.SDCardDir+`/DataGalery/${nameLower}.json`, `${JSON.stringify(obj)}`, 'utf8')
                .then(res => {
                    // console.log('arquivo salvo: ', res); 
                }).catch(err => { console.log('falha ', err);
            });
        
            await RNFetchBlob.fs.ls(RNFetchBlob.fs.dirs.SDCardDir+'/DataGalery').then(res => { 
                let trFls = res.includes(nameLower+'.json');
                this.setFileExists(trFls);
                trueOrFalse = this.getFileExists();
            });
            return trueOrFalse;
        }
    }

    async removeFileFromAlbum(files, album) {
        const fileReady = await this.listPictures(album);
        let arrayFromObject = [];
        let newObj = [];
        
        for(let i=0;i<fileReady.length;i++){
            arrayFromObject[arrayFromObject.length] = fileReady[i]["file"];
        }
        
        for(let y=0;y<files.length;y++){
            let indice = arrayFromObject.indexOf(files[y]);
            while(indice >= 0) {
                arrayFromObject.splice(indice, 1);
                indice = arrayFromObject.indexOf(files[y])
            }
        }

        newObj = await this.createObject(arrayFromObject);
        await RNFetchBlob.fs.writeFile(RNFetchBlob.fs.dirs.SDCardDir+`/DataGalery/${album}`, `${JSON.stringify(newObj)}`, 'utf8')
            .then(res => {
                // console.log('arquivo salvo: ', res); 
            }).catch(err => { console.log('falha ', err);
        });
    }

    async deleteFile(file) {
        await RNFetchBlob.fs.unlink(RNFetchBlob.fs.dirs.SDCardDir+`/DataGalery/${file}`).then(res => {
            // console.log(res);
        });
    }

    async listPictures(album){
        let obj = {files: []};
        
        if (album == ''){
            return [];
        } else {
        
            await RNFetchBlob.fs.readFile(RNFetchBlob.fs.dirs.SDCardDir+`/DataGalery/${album}`).then(res => {
                let string_to_obj = JSON.parse(res); 
                obj["files"] = string_to_obj["files"];
            });
            obj["files"] === undefined? obj["files"] = [] : obj["files"];
            return obj["files"];
        }
    }

    async resultCheck(){
        let dirs = await this.listDirectories();
        let files = '';
        let moreDirs = [];
        let response = [];
        
        while(!response[0] || response[0].length > 0){
        
            if (response[0]){
                console.log(response[0].length);
                response = await this.checkDirs(response[0]);
                moreDirs = response[0];
                files = [...files,response[1]];
            } else {
               response = await this.checkDirs(dirs);
                moreDirs = response[0];
                files = [...files,response[1]];
            }
        }
        // console.log(files);
        
    }

    async listDirectories() {
        let systemDirs = [];
        let i = 0;
        const FS = RNFetchBlob.fs;
        const EXTERNAL_DIR = FS.dirs.SDCardDir;
        
        await FS.ls(EXTERNAL_DIR).then(res => {
            while(i < res.length){
                systemDirs[i] = EXTERNAL_DIR+'/'+res[i];  
                i++;              
            }
        });
        return systemDirs;
    }

    async travelPath(folderPath = Array) {
        let response = [];
        const FS = RNFetchBlob.fs;
        
        await FS.ls(folderPath).then(res => {
            if(res.length > 0){
                response = res;
            }
        });
        return response;
    }

    async checkDirs(dirs = Array) {
        let i = 0;
        let files = [];
        let moreDirs = [];
        const fun = (async () => {
            while(i < dirs.length){
                let result = [];
                result = await this.travelPath(dirs[i]);
                
                if(result.length > 0){
                    let indResult = 0;
                    
                    while(indResult < result.length){
                        let isdir = await this.isDirectory(`${dirs[i]}/${result[indResult]}`);
                        
                        if ( isdir === true ) {
                            moreDirs = [...moreDirs, `${dirs[i]}/${result[indResult]}`];
                        
                        } else {
                            let path = `${dirs[i]}/${result[indResult]}`;
                            
                            if(path.includes('.png') || path.includes('.jpg') || path.includes('.jpeg') || path.includes('.gif') ){
                                files = [...files, path];
                            }
                        }
                        indResult++;
                    }
                }
                i++;
            }
        });
        await fun();
        return [moreDirs, files];
    }
    
    async isDirectory(path) {
        const FS = RNFetchBlob.fs;
        let response = false;
        await FS.isDir(path).then(res => {
            response = res;
        });
        return response;
    }

    async createObjectContent(name_obj, array = Array) {
        let obj = {};
        if(obj.length === undefined){
            obj[`${name_obj}`] = [];
        }
        for(let i=0;i<array.length;i++){
            obj[`${name_obj}`][obj[`${name_obj}`].length] = {"file": array[i]};
        }
        return obj;
    }
}
export default Storage;