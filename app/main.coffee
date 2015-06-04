# TODO:
#  on Img Error: cyclePhoto
#  add fx overlay on each photo (ISO/FPS)
#  Remove cursor
#  Make fullscreen default
#  add fx on change


toggleFullscreen = ->
    console.log("togglefullscreen")

    if not document.fullscreenElement  and 
       not document.mozFullScreenElement and  
       not document.webkitFullscreenElement and not document.msFullscreenElement
        if document.documentElement.requestFullscreen
            document.documentElement.requestFullscreen()
        else if (document.documentElement.msRequestFullscreen)
            document.documentElement.msRequestFullscreen()
        else if (document.documentElement.mozRequestFullScreen)
            document.documentElement.mozRequestFullScreen()
        else if (document.documentElement.webkitRequestFullscreen)
            document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)

        $('#bt-fullscreen').hide()
    else
        if (document.exitFullscreen)
            document.exitFullscreen()
        else if (document.msExitFullscreen)
            document.msExitFullscreen()
        else if (document.mozCancelFullScreen)
            document.mozCancelFullScreen()
        else if (document.webkitExitFullscreen)
            document.webkitExitFullscreen()

        $('#bt-fullscreen').show()


window.cyclePhoto = (el) ->
    console.log(el)
    return;


Settings = Settings ? {
    el: '#cameralist',
    cycle: {
            left_time: 15000,
            left_start: 1000,
            right_time: 15000,
            right_start: 5000
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
    historyWeight: []

    add: (models, opts) ->
        @historyWeight.push 1
        console.log("Opts, it twerked!")
        Backbone.Collection.prototype.add.call(@, models,opts)
        @trigger('added', models)

    pickRandom: ->
        rand = chance.pick( @models )
        return rand

    # pick a camera, avoiding already used cameras
    pickSemiRandom: ->
        # Use random with @historyWeight
        next_cam = chance.weighted( @models , @historyWeight )

        # This cam now has 1/4 of chance of being randomly picked again
        cam_idx  = @models.indexOf(next_cam)
        @historyWeight[cam_idx] = @historyWeight[cam_idx]/4.0

        return next_cam



class Camera extends Backbone.View
    ###
        A single video camera. Knows how to display mjpeg streams,
        and also jpeg with autorefresh
    ###
    tagName:   'section'
    className: 'feed-box'

    template: _.template("""<div class="feed-stream">
                            <img src="<%= uri %>"
                                caption="<%= city %>" 
                                onerror="cyclePhoto">
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

    hidePhoto: =>
        console.log("OPTS, ERROR")
        $(this).hide()

    unrender: =>
        $(@el).remove()





class AppBigBrother extends Backbone.View

    el:  '#cameralist'
    cameras: [],
    events: {
        'click #bt-cyclecameras': 'cycleCameras'
    }
    cycleHistory: []

    initialize: (@settings) ->
        cam_one = CAMFEEDS.pickSemiRandom()
        cam_two = CAMFEEDS.pickSemiRandom()
        @appendCamera( cam_one  )
        @appendCamera( cam_two )

        @render()

    setAutoCycle: =>
        setTimeout( =>
            setInterval( =>
                @cycleCamera(0)
            , Settings.cycle.left_time)
        , Settings.cycle.left_start)

        setTimeout( =>
            setInterval( =>
                @cycleCamera(1)
            , Settings.cycle.right_time)
        , Settings.cycle.right_start)

    appendCamera: (camera_stream) ->
        cam = new Camera model: camera_stream
        @cameras.push( cam )
        $(@el).append cam.render().el

    cycleCamera: (camera_idx=0) =>
        # use ImagesLoaded
        imgLoad.on( 'progress', onProgress )
        imgLoad.on( 'always', onAlways )

        new_cam = CAMFEEDS.pickSemiRandom()

        @cameras[camera_idx].cycle( new_cam )

        imgLoad = imagesLoaded( @el )

    onProgress: =>
        console.log("Progress loading...")

    onAlways: =>
        console.log("Finished loading images")


    render: ->
        $(@el).html()


window.CAMFEEDS=[]
window.app = null
jQuery ->
    $.getJSON Settings.camfeed.url, (feeds) ->
        window.CAMFEEDS = new CameraFeeds
        _.each( feeds, (feed) =>
            stream = new CameraStream( feed  )
            window.CAMFEEDS.add stream
        )
        window.app = new AppBigBrother( Settings )

        # Or, hide them
        ###
        $(document).on('error', 'img', (e) ->
            console.log("OPTS, ERROR")
            $(this).hide()
        )
        ###

        $('#bt-fullscreen').on 'click', toggleFullscreen
        window.app.setAutoCycle()
