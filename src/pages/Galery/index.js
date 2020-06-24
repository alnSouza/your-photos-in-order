import React, { useState, useEffect }from 'react';
import { 
    Text, 
    View, 
    FlatList,
    StyleSheet, 
    Image,
    Dimensions, 
    TouchableOpacity, 
    ImageBackground} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Storage from '../../actions/AccesStorage/storage.js';
import { useNavigation } from '@react-navigation/native';
import {
    MenuProvider,
    MenuOptions,
    MenuOption,
    MenuTrigger,
    Menu,
    
} from 'react-native-popup-menu';
import RNFetchBlob from 'rn-fetch-blob';
import Share from 'react-native-share';
import CheckBox from '@react-native-community/checkbox';
const storage = new Storage();
const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;
const coluns = 3;
let values = [];

export default function Galery() {
    const navigation = useNavigation();
    const [data, setData] = useState([]);
    const [selected, setSelected] = useState([]); 
    const [albums, setAlbums] = useState([]);
    const onShare = async () => {
        await Share.open({
            message: '',
            title: '',
            urls: selected,
            activityItemSources: [{thumbnailImage: selected[0]}]
          });
          if (result.action === Share.sharedAction) {
            if (result.activityType) {
              // shared with activity type of result.activityType
              navigation.navigate('Home');
            } else {
                navigation.navigate('Home');
                    // shared
            }
          } else if (result.action === Share.dismissedAction) {
            // dismissed
        }
    }

    function handleOpenPicture(path_file){
        navigation.navigate("Picture", {path_file: path_file});
    }

    function onSelectItem(item){
        const path_image = `file:///storage/emulated/0/DCIM/Camera/${item}`;
        const result = !values.includes(path_image);
        switch(result) {
            case true:
                values = [...values, path_image];
                break;
            case false:
                const filtred = values.filter((index) => path_image !== index);
                values = filtred;
                break;
        }
        setSelected(values);

        // listDataGalery();
    }

    function Item({file, index}) {
        const path = `file:///storage/emulated/0/DCIM/Camera/${file}`;
        let color = '#ccc';
        let selectedCheck = false;
        if (!file) {
            return <View key={index} style={[styles.invisible]}></View>;
        } else {
            const bool = selected.includes(path);
            if (bool === true) {
                color = '#';
                selectedCheck = true;
            }
            return (
                <TouchableOpacity activeOpacity={0.8} style={styles.item, {margin: 2}} key={index}
                onPress={() => {handleOpenPicture(path)} }>
                    <ImageBackground style={styles.image} 
                    source={{uri: path}}>
                        <CheckBox
                        disabled={false}
                        value={selectedCheck}
                        tintColors={{true: "rgba(4, 137, 246, 0.932)", false: 'silver'}}
                        onValueChange={() =>  {selectedCheck === true?selectedCheck = false:selectedCheck, onSelectItem(file)}}
                        />
                    </ImageBackground>
                    {/* <View style={{borderColor: '#ccc', borderWidth: 1, borderRadius: 20, backgroundColor: '#FFF', width: 30,height:30, alignContent: 'center', alignItems: 'center'}}> */}
                        
                    {/* </View> */}
                    
                </TouchableOpacity>
                
                
            );    
        }  
    }
   
    function dataForm(data, coluns){
        const rows = Math.floor(data.length / coluns);
        let lastRow = data.length - (rows * coluns);

        while(rows !== 0 && lastRow !== coluns) {
            data.push({key: 'blank', empty: true});
            lastRow++;
        }
        return data;
    }
   
    function handleNavigateBack() {
        navigation.goBack();
    }

    async function addToAlbum(album, pictures) {
        const old_files = await storage.listPictures(album);

        if ( old_files.length < 1) {
            await writeInAlbum(album, pictures);
        } else {
            for(let i=0;i<old_files.length;i++){
                if (pictures.includes(old_files[i]["file"])) {
                } else {
                    pictures[pictures.length] = old_files[i]["file"];
                }
            }
            await writeInAlbum(album, pictures);
        }
    }

    async function writeInAlbum(album, pictures) {
        const obj = await storage.createObject(pictures);
        await RNFetchBlob.fs.writeFile(RNFetchBlob.fs.dirs.SDCardDir+`/DataGalery/${album}`, JSON.stringify(obj), 'utf8').then(res => {
            console.log(res);
        }).catch(err => { console.log(err)});
        navigation.navigate('Album', { album: album });
    }

    function clearSelected() {
        values = [];
        setSelected([]);
    }

    async function listCamera() {
        
        const response = await storage.listFilesInCamera();
        setData(response);
    }

    async function listDataGalery() {
        const response = await storage.listFilesInDataGalery();
        setAlbums(response);
    }

    useEffect(() => {
        listCamera();
        listDataGalery();
    }, []);

    
    return (
        <MenuProvider>
            <View style={styles.container}>
                <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity style={[styles.btn]} onPress={handleNavigateBack}>
                        <Icon name="arrow-left" color="rgba(4, 137, 246, 0.932)" size={30} />
                    </TouchableOpacity>
                    <View style={[styles.options, selected.length < 1 ? styles.optionsVisibleFalse : {} ]}>
                        <View style={{flexDirection: 'row-reverse'}}>
                            <TouchableOpacity onPress={onShare} style={styles.btn}>
                                <Icon name="share-2" color="rgba(4, 137, 246, 0.932)" size={25} />
                            </TouchableOpacity>
                            
                            <TouchableOpacity onPress={() => {}} style={styles.btn}>
                                <Menu>
                                    <MenuTrigger>
                                        <Icon name="folder" color="rgba(4, 137, 246, 0.932)" size={25} />
                                    </MenuTrigger>
                                    <MenuOptions>
                                        {albums.map((album, index) => 
                                        <MenuOption key={index} onSelect={() => addToAlbum(album.file, selected)} style={{height:40, alignItems: 'center', flexDirection: 'row'}}>
                                            <Icon name="folder" size={20} />
                                            <Text style={{marginLeft:5}}>{album.file.replace(".json", '')}</Text>
                                        </MenuOption>
                                        )}
                                    </MenuOptions>
                                </Menu>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={clearSelected} style={styles.btn}>
                                <Text>{selected.length}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <FlatList
                data={dataForm(data, coluns)}
                renderItem={({ item, index }) => Item(item, index)}
                keyExtractor={(item, index) => index.toString()}
                numColumns={coluns}
                />
            </View>
        </MenuProvider>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF'
  },
  options:{
    alignItems: 'flex-end', width: Width / 1.2
  },
  optionsVisibleFalse: {
      display: 'none'
  },
  btn:{
    backgroundColor: 'rgba(245, 249, 252, 0.993)', 
    width:40,
    height:40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    marginTop: 5,
    marginEnd: 2,
    marginLeft: 5,
    marginBottom:15
  },
  item: {
    backgroundColor: '#FFF',
    margin: 2,
    height: Width / 3.64,
    height: Height / coluns - 1.4,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  image: {
    width: Width/ coluns - 4,
    height: Height / coluns - 30,
    resizeMode: 'cover'
  },
  invisible: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  selectedItem: {
    borderColor: 'rgba(4, 137, 246, 0.932)',
    borderWidth: 2
  }
});
