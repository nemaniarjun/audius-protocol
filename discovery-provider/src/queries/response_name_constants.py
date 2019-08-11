# track/playlist metadata
repost_count = 'repost_count' # integer - total repost count of given track/playlist
save_count = 'save_count' # integer - total save count of given track/playlist
has_current_user_reposted = 'has_current_user_reposted' # boolean - has current user reposted given track/playlist
has_current_user_saved = 'has_current_user_saved' # boolean - has current user saved given track/playlist
followee_reposts = 'followee_reposts' # array - followees of current user that have reposted given track/playlist

# user metadata
follower_count = 'follower_count' # integer - total follower count of given user
followee_count = 'followee_count' # integer - total followee count of given user
playlist_count = 'playlist_count' # integer - total count of playlists created by given user
album_count = 'album_count' # integer - total count of albums created by given user (0 for all non-creators)
track_count = 'track_count' # integer - total count of tracks created by given user
repost_count = 'repost_count' # integer - total count of reposts by given user
does_current_user_follow = 'does_current_user_follow' # boolean - does current user follow given user
current_user_followee_follow_count = 'current_user_followee_follow_count' # integer - number of followees of current user that also follow given user

# feed metadata
activity_timestamp = 'activity_timestamp' # string - timestamp of relevant activity on underlying object,
                                          # used for sorting