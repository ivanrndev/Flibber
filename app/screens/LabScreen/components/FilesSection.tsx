import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  Alert,
  Dimensions,
  Keyboard,
  Modal,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useFirestoreServiceContext} from '../../../hooks/useFirestoreService';
import storage, {FirebaseStorageTypes} from '@react-native-firebase/storage';
import Pdf from 'react-native-pdf';

interface IFilesSectionProps {
  filesArray: FirebaseStorageTypes.TaskSnapshot[];
  setFilesArray: Dispatch<
    SetStateAction<[] | FirebaseStorageTypes.TaskSnapshot[]>
  >;
  isCreateMode: boolean;
}

function FilesSection({
  filesArray,
  setFilesArray,
  isCreateMode,
}: IFilesSectionProps) {
  const [modalVisible, setModalVisible] = useState<string | null>(null);
  const {uploadFirestoreCloudFile} = useFirestoreServiceContext();

  const [keyboardStatus, setKeyboardStatus] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardStatus(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardStatus(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const uploadFile = async () => {
    const res = await uploadFirestoreCloudFile();
    if (res) {
      setFilesArray(prevState => [...prevState, res]);
    }
  };

  const openModal = useCallback(
    async (index: number) => {
      console.log('openModal filterarray', filesArray[index].metadata.fullPath);
      const res = await storage()
        .ref()
        .child(filesArray[index].metadata.fullPath)
        .getDownloadURL();
      setModalVisible(res);

      console.log('openModal filterarray refrefref', res);
    },
    [filesArray],
  );
  console.log('files arrrraaay', filesArray);

  const _renderList = useCallback(
    () =>
      filesArray.length === 0 ? (
        <Text>No files for now</Text>
      ) : (
        <>
          {filesArray.map((i, index) => (
            <Text
              onPress={() => openModal(index)}
              style={{fontSize: 20, padding: 5, width: 200}}
              ellipsizeMode="tail"
              numberOfLines={1}>
              {i.metadata.name}
            </Text>
          ))}
        </>
      ),
    [filesArray],
  );
  return !keyboardStatus ? (
    <View style={{flexGrow: 0, flexDirection: 'row'}}>
      {!isCreateMode ? <Text onPress={uploadFile}>Press to upload</Text> : null}
      <View style={{borderWidth: 1, marginLeft: 20}}>{_renderList()}</View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={!!modalVisible}
        onRequestClose={() => {
          // Alert.alert('Modal has been closed.');
          setModalVisible(null);
        }}>
        {/*<View style={styles.centeredView}>*/}
        {/*  <View style={styles.modalView}>*/}
        {/*    <Text style={styles.modalText}>Hello World!</Text>*/}
        {/*    <Pressable*/}
        {/*      style={[styles.button, styles.buttonClose]}*/}
        {/*      onPress={() => setModalVisible(!modalVisible)}>*/}
        {/*      <Text style={styles.textStyle}>Hide Modal</Text>*/}
        {/*    </Pressable>*/}
        {/*  </View>*/}
        {/*</View>*/}
        <View style={styles.container}>
          <Text
            style={{fontSize: 20, paddingBottom: 80}}
            onPress={() => setModalVisible(null)}>
            close
          </Text>
          <Pdf
            trustAllCerts={false}
            source={{uri: modalVisible!, cache: true}}
            onLoadComplete={(numberOfPages, filePath) => {
              console.log(`Number of pages: ${numberOfPages}`);
            }}
            onPageChanged={(page, numberOfPages) => {
              console.log(`Current page: ${page}`);
            }}
            onError={error => {
              console.log(error);
            }}
            onPressLink={uri => {
              console.log(`Link pressed: ${uri}`);
            }}
            style={styles.pdf}
          />
        </View>
      </Modal>
    </View>
  ) : null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 35,
    backgroundColor: 'white',
  },
  pdf: {
    // paddingTop: 55,
    borderWidth: 1,
    backgroundColor: 'grey',
    width: Dimensions.get('window').width / 2,
    height: 300,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default React.memo(FilesSection);
