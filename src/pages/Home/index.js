import React, { useState, useEffect, useRef } from 'react';
import { View, 
    Text, 
    FlatList,
    Animated,
    StyleSheet,
    Dimensions, 
    StatusBar,
    ScrollView,
    Image,
    ImageBackground,
    PermissionsAndroid,
    Alert} from 'react-native';
import { RectButton, TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import Storage from '../../actions/AccesStorage/storage';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const storage = new Storage();
const coluns = 2;
const Home = () => {
    const navigation = useNavigation();
    const [perm, setPerm] = useState('');
    const [albuns, setAlbum] = useState([]);
    const routes = useRoute();
    const routeParams = routes.params;

    async function checkPermissionStorage(){
        try {
            const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
                title: "Requerida permissao ao Storage",
                message:
                "Precisamos acessar seus arquivos " +
                "para permitir que use este aplicativo.",
                buttonPositive: "Ok"
            });
            setPerm(granted);
        } catch (err) {
            setPerm(err);
        }
     
    }
    
    async function listAlbuns(){
        setAlbum([]);
        const data = await storage.listFilesInDataGalery();
        setAlbum(data);
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

    function Item({file, index}){
        if (!file) {
            return <View style={[styles.invisible]}></View>;
        } else {
            return (
                <TouchableOpacity activeOpacity={0.8} onLongPress={() => { removeAlbum(file) }} onPress={() => handleNavigateAlbum(file)} key={index} style={styles.card}>        
                    <Image source={require("../../assets/folder.png")} 
                    style={{ width: 80, height: 70}} />
                    <Text style={{color:'#FFF'}}>{file.replace('.json', '')}</Text>
                </TouchableOpacity>
            );
        }
    }

    function createAlbum() {
        navigation.navigate('newAlbum');
    }

    function handleNavigateAlbum(album) {
        navigation.navigate('Album', { album: album });
    }

    function handleNavigateGalery(){
        navigation.navigate('Galeria');
    }

    async function removeAlbum(album) {
        Alert.alert(
            'Aviso',
            'você esta prestes a remover um album!',
            [
                {
                    text: 'Cancelar', 
                    onPress: () => {return;}
                },
                {
                    text: 'Remover', 
                    onPress: () => { storage.deleteFile(album); listAlbuns(); },
                }
            ]
        );
    }

    useEffect(() => {
        checkPermissionStorage();
    }, [perm === 'denied']);
    
    
    useEffect(() => {
        storage.resultCheck();
    },[]);

    useEffect(() => {
        listAlbuns();
    },[routeParams]);

    const ani = useRef(new Animated.Value(0)).current;

    const fadeIn = () => {
        listAlbuns();

        Animated.timing(ani, {
            toValue: 2000,
            duration: 2000,
            useNativeDriver: true,
            
        }).start(() => stop())
      
    };

    const stop = () => {
        Animated.timing(ani,{
            toValue:0,
            duration:1,
            useNativeDriver: true
        }).start()
    }
    
    const rotateIn =  ani.interpolate({
        inputRange: [0, 360],
        outputRange:["0deg", "360deg"]
        }
    )

    const stylesAni = {
        transform: [{rotate: rotateIn}]
    }
    
    return (
        <View style={styles.container}>
         
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <View style={styles.header}>
                <Text>Seus albums</Text>
                <Text>Versao: 1.0</Text>
            </View>
            <ImageBackground source={require('../../assets/banner.png')} style={styles.banner}></ImageBackground>
            <View style={{flexDirection: 'row'}}>
                <ScrollView alwaysBounceVertical width={250} height={HEIGHT / 2.02}>
                    <FlatList
                    data={dataForm(albuns, coluns)}
                    renderItem={({ item, index }) => <Item key={index} file={item.file} />}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={coluns}
                    />    
                </ScrollView>
                <View style={styles.containerButtons}>
                    <RectButton style={styles.btn} onPress={createAlbum}>
                        <Icon name="plus" color="rgba(4, 137, 246, 0.932)" size={25} ></Icon>
                    </RectButton>
                    <RectButton style={styles.btn} onPress={handleNavigateGalery}>
                        <Icon name="image" color="rgba(4, 137, 246, 0.932)" size={25} ></Icon>
                    </RectButton>
                    <RectButton style={styles.btn} onPress={fadeIn}>
                        <Animated.View style={ stylesAni} >
                                <Icon name="refresh-cw" color="rgba(4, 137, 246, 0.932)" size={25} ></Icon>
                        </Animated.View>
                    </RectButton>
                    
                </View>
            </View>
        </View> 
    );
};

const styles = StyleSheet.create({
    container: {
        width: WIDTH,
        height: HEIGHT,
        flex: 1,
        backgroundColor: '#cccc'

    },
    header:{
        borderBottomWidth: 1, 
        width: WIDTH, 
        alignItems: 'center', 
        backgroundColor: '#FFF'
    },
    containerButtons:{
        alignItems: 'flex-end', 
        justifyContent: 'flex-end', 
        width: WIDTH / 4.5, 
        height: 290, 
        padding:10},
    btn:{
        backgroundColor: 'rgba(245, 249, 252, 0.993)', 
        width:50,
        height:50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        marginTop: 10,
    },
    card: {
        width:130,
        height: 120,
        backgroundColor: '#2f363d',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginLeft:5,
        padding: 15,
        borderRadius: 10
    },
    banner:{width: WIDTH, height: HEIGHT / 2.5}
});

export default Home;