export const BASEURL = 'http://0.0.0.0:8081/api';
export const FILEURL = 'http://localhost:8081/';
// export const BASEURL = 'https://api.thehylm.com/api';
// export const FILEURL = 'https://api.thehylm.com/';

export const ROUTES = {
    'register':'/users/register',
    'login':'/users/login',
    'add_channel':'/channels/add',
    'fetch_channels':'/channels/fetch',
    'search_channel':'/channels/search',
    'add_events':'/events/add',
    'fetch_events':'/events/fetch',
    'add_watchlist':'/channels/add_watchlist',
    'remove_watchlist':'/channels/remove-watchlist/:channelId',
    'fetch_watchlist':'/channels/fetch_watchlists',
    'delete_channel':'/channels/delete/:channelId',
    'event_feeds':'/events/feeds',
    'delete_event':'/events/delete/:eventId',
    'update_event':'/events/update',
    'post_feed':'/feeds/post',
    'fetch_feeds':'/feeds/fetch',
    'fetch_feeds_by_id':'/feeds/fetch-feedsById',
    'delete_feed':'/feeds/delete/:deleteId',
    'update_feed':'/feeds/update/:feedId'

}