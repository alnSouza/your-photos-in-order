import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, FlatList,Dimensions} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import Storage from '../../actions/AccesStorage/storage';
import CheckBox from '@react-native-community/checkbox';
import Share from 'react-native-share';
// import ImgToBase64 from 'react-native-image-base64';
 

const storage = new Storage();
const Width = Dimensions.get('window').width;
const coluns = 3;
const Album = () => {
    const navigation = useNavigation();
    const [data, setData] = useState([]);
    const [selected, setSelected] = useState([]);
    // const [dataBinImages, setDataBinImages] = useState([]);
    const routes = useRoute();
    const routeParams = routes.params;
    // async function baseM(image_path) {
    //     ImgToBase64.getBase64String(image_path)
    //         .then(base64String => setDataBinImages([...dataBinImages, 'data:image/png;base64,'+base64String]))
    //         .catch(err => console.log(err)
    //         );
    // }
    
    const onShare = async () => {
        await Share.open({
            message: '',
            title: '',
            urls: selected,   
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

    function handleOpenPicture(file){
        navigation.navigate("Picture", {path_file: file});
    }
    function Item({file, index}) {
        let color = '#ccc';
        let selectedCheck = false;
        if (!file) {
            return <View style={[styles.invisible]}></View>;
        } else {
            const bool = selected.includes(file);
            if (bool === true) {
                color = '#';
                selectedCheck = true;
            }
            return (
                <TouchableOpacity activeOpacity={0.8} style={styles.item, {margin: 2}} key={index}
                onPress={() => {handleOpenPicture(file)} }>
                    <ImageBackground style={styles.image} 
                    source={{uri: file}}>
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

    function onSelectItem(item){
        const path_image = item;
        if (!selected.includes(path_image)){
            setSelected([...selected, path_image]);
        }
        if (selected.includes(path_image)){
            const filtred = selected.filter((index) => path_image !== index);
            setSelected(filtred);
        }
    }

    function clearSelected() {
        setSelected([]);
    }

    async function removePicture() {
       await storage.removeFileFromAlbum(selected, routeParams["album"]);
       await loadPictures();
       setSelected([]);
    }

    function handleNavigateBack() {
        navigation.goBack();
    }

    async function loadPictures() {
        const response = await storage.listPictures(routeParams["album"]);
        setData(response);
    }
    
    useEffect(() => {
        loadPictures();
    }, [routeParams]);
    
    return(
        <View style={styles.container}>
            <View style={{flexDirection: 'row'}}>
                <TouchableOpacity style={[styles.btn]} onPress={handleNavigateBack}>
                    <Icon name="arrow-left" color="rgba(4, 137, 246, 0.932)" size={30} />
                </TouchableOpacity>
                <Text style={{marginLeft:5,marginTop:15,marginRight:0, textTransform: 'capitalize'}}>{routeParams["album"].replace('.json', '')}</Text>
                <View style={[styles.options, selected.length < 1? styles.optionsVisibleFalse : {} ]}>
                    
                    <View style={{flexDirection: 'row-reverse'}}>
                        <TouchableOpacity onPress={onShare} style={styles.btn}>
                            <Icon name="share-2" color="rgba(4, 137, 246, 0.932)" size={25} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => removePicture()} style={styles.btn}>
                            <Icon name="trash" color="rgba(4, 137, 246, 0.932)" size={25} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={clearSelected} style={styles.btn}>
                            <Text>{selected.length}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <FlatList
            data={dataForm(data, coluns)}
            renderItem={({ item, index }) => <Item key={index} file={item.file} />}
            keyExtractor={(item, index) => index.toString()}
            numColumns={coluns}
            />
        </View>
        
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFF'
    },
    options:{
      alignItems: 'flex-end', width: Width / 2.5
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
      height: Width / 2.6,
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1
    },
    image: {
      width: Width/ coluns,
      height: Width / coluns,
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
  

export default Album;