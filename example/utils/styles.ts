import { StyleSheet } from 'react-native';

export const backgroundColor = '#fedd1e';

const styles = StyleSheet.create({
  padding10: {
    padding: 10,
  },
  absolute: {
    position: 'absolute',
  },
  rightTop: {
    top: 10,
    right: 10,
  },
  bold: {
    fontWeight: '700',
  },
  blue: {
    color: '#2188E5',
  },
  borderBottom: {
    borderStyle: 'solid',
    borderColor: '#9B9C9C',
    borderBottomWidth: 1,
  },
  center: {
    alignSelf: 'center',
  },
  textCenter: {
    textAlign: 'center',
    justifyContent: 'center',
  },
  paddingTB10: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  paddingLR10: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  wide: { flex: 20 },
  flex1: { flex: 1 },
  header: {
    backgroundColor,
  },
  text: {
    color: '#000',
  },
  footer: {
    justifyContent: 'flex-end',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  body: {
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  container: {
    flexDirection: 'column',
  },
  border: {
    borderStyle: 'solid',
    borderColor: 'red',
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'stretch',
  },
});

export default styles;