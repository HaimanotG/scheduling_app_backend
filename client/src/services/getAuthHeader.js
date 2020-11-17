import localStore from './localStore';

export default async () => {
    const user = await localStore.get('user');
    const {sessionToken} = user;
    return ({authorization:`Bearer ${sessionToken}`});
}