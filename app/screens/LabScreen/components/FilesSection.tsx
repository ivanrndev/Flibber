import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
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
import {useTheme} from '../../../theme/useTheme';

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
    theme =>
      filesArray.length === 0 ? (
        <Text style={{color: theme.color}}>No files for now</Text>
      ) : (
        <>
          {filesArray.map((i, index) => (
            <Text
              onPress={() => openModal(index)}
              style={{fontSize: 20, padding: 5, width: 200, color: theme.color}}
              ellipsizeMode="tail"
              numberOfLines={1}>
              {i.metadata.name}
            </Text>
          ))}
        </>
      ),
    [filesArray, openModal],
  );

  const {theme} = useTheme();
  return !keyboardStatus ? (
    <View style={{flexGrow: 0, flexDirection: 'row', paddingBottom: 10}}>
      {!isCreateMode ? (
        <Text style={{color: theme.color}} onPress={uploadFile}>
          Press to upload
        </Text>
      ) : null}
      <View
        style={{
          borderWidth: 1,
          marginLeft: 20,
          borderColor: theme.color,
          borderRadius: 10,
          padding: 5,
        }}>
        {_renderList(theme)}
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={!!modalVisible}
        onRequestClose={() => {
          setModalVisible(null);
        }}>
        <View style={styles.container}>
          <Text
            style={{fontSize: 30, paddingBottom: 20}}
            onPress={() => setModalVisible(null)}>
            close
          </Text>
          <Pdf
            trustAllCerts={false}
            source={{uri: modalVisible!, cache: true}}
            onLoadComplete={numberOfPages => {
              console.log(`Number of pages: ${numberOfPages}`);
            }}
            onPageChanged={page => {
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
    paddingTop: 15,
    backgroundColor: 'white',
  },
  pdf: {
    borderWidth: 1,
    backgroundColor: 'grey',
    width: Dimensions.get('window').width / 1.2,
    height: Dimensions.get('window').height / 1.2,
  },
});

export default React.memo(FilesSection);
