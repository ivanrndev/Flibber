import DocumentPicker, {
  DocumentPickerResponse,
  types,
} from 'react-native-document-picker';

export const FILE_UPLOAD_TYPES = {
  PDF: types.pdf,
  DOC: types.doc,
  IMG: types.images,
} as const;

export enum SectionTypes {
  Files = 'files',
  Images = 'images',
}

type UserID = string;
type UUID = string;
type fileName = string;
export type CloudStorageFilePath =
  `${SectionTypes.Files}/${UserID}/${UUID}/${fileName}`;
export type CloudStorageImagePath =
  `${SectionTypes.Images}/${string}/profile_image`;

type FileUploadType =
  (typeof FILE_UPLOAD_TYPES)[keyof typeof FILE_UPLOAD_TYPES];

export const openFilePicker = (
  type: FileUploadType,
): Promise<DocumentPickerResponse | null> =>
  DocumentPicker.pick({
    type,
    copyTo: 'cachesDirectory',
  })
    .then(res => {
      console.log('openFilePicker ppp', res);
      return res[0];
    })
    .catch(e => {
      console.log(' openFilePicker errrr', e);
      return null;
    });
