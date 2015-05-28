Settings = Settings ? {
    el: '#cameralist',
    cycle: {
            time_seconds: 60,
            time_random: true
    },
    camfeed: {
            url: 'assets/cameras.feed.json',
            feeds: []
    }
}


class CameraStream extends Backbone.Model
    defaults:
        uri:     'http://158.39.49.51:80/mjpg/video.mjpg'
        country: 'Russia'
        city:    'Megalopole'

class CameraFeeds extends Backbone.Collection
    model: CameraStream
    localStorage: new Store('CameraFeeds')


class Camera extends Backbone.View
    ###
        A single video camera. Knows how to display mjpeg streams,
        and also jpeg with autorefresh
    ###
    tagName: 'section'
    className: 'feed-box'

    template: _.template("""<div class="feed-stream">
                            <img src="<%= uri %>" 
                                caption="<%= city %>" >
                            </div>"""),

    initialize: ->
        @model.bind 'add', @render
        @model.bind 'change', @render
        @model.bind 'remove', @unrender

    cycle: (new_feed) =>
        @model.set( 'uri', new_feed.get('uri') )
        @model.set( 'city', new_feed.get('uri') )
        @model.set( 'country', new_feed.get('country') )

    render: =>
        $(@el).html( @template( @model.toJSON() ) )
        return @

    unrender: =>
        $(@el).remove()





class AppBigBrother extends Backbone.View

    el:  '#cameralist'
    cameras: [],
    events: {
        'click #bt-cyclecameras': 'cycleCameras'
    }

    initialize: (@settings) ->
        @idx = Math.floor( Math.random() * CAMFEEDS.length-1 )
        @appendCamera( CAMFEEDS.at(@idx ) )
        @appendCamera( CAMFEEDS.at(@idx+1 ) )

        @render()

    appendCamera: (camera_stream) ->
        cam = new Camera model: camera_stream
        @cameras.push( cam )
        $(@el).append cam.render().el

    cycleCameras: =>
        console.log("Cycling cameras");
        @idx = Math.floor( Math.random() * CAMFEEDS.length-1 )
        @cameras[0].cycle( CAMFEEDS.at(@idx))
        @cameras[1].cycle( CAMFEEDS.at(@idx+1))


    render: ->
        $(@el).html()


window.CAMFEEDS=[]
window.app = null
jQuery ->
    $.getJSON Settings.camfeed.url, (feeds) ->
        window.CAMFEEDS = new CameraFeeds
        _.each( feeds, (feed) =>
            console.log(feed)
            stream = new CameraStream( feed  )
            window.CAMFEEDS.add stream
        )
        window.app = new AppBigBrother( Settings )
        $('#bt-cyclecameras').on 'click', window.app.cycleCameras
