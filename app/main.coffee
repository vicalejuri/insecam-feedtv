# TODO:
#  on Img Error: cyclePhoto -OK
#  Remove cursor - OK
#  Make fullscreen default - OK
#  add fx on change - OK
#
#  automatic refresh on non .mjpeg images - OK
#  remove pictures with errors - OK
#
#  Add keyboard handle anykey on start.
#   Remove it after, plz
#
ANIM_END = 'webkitAnimationEnd oanimationend msAnimationEnd animationend transitionend'

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



Settings = Settings ? {
    el: '#cameralist',
    css: {
        blackwhite: true
    }
    cycle: {
            interval: 15*1000,
            offset: 7000
    },
    camfeed: {
            url: 'assets/cameras.feed.json',
            feeds: [],
            fps: 1/3.0
    }
}


class CameraStream extends Backbone.Model
    defaults:
        uri:     'http://www.error.error/none.mjpeg'
        country: 'None'
        city:    'None'


class CameraFeeds extends Backbone.Collection
    model: CameraStream
    localStorage: new Store('CameraFeeds')
    historyWeight: []

    add: (models, opts) ->
        @historyWeight.push 1
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
        curr_prob = @historyWeight[cam_idx]

        @setRandomProbability(next_cam, curr_prob/4.0)

        return next_cam

    setRandomProbability: ( cam , prob) ->
        cam_idx = @models.indexOf(cam)
        console.log("RANDOM: feed #{cam_idx}:#{cam.get('city')} = #{prob}%")
        @historyWeight[cam_idx] = prob


class Camera extends Backbone.View
    ###
        A single video camera. Knows how to display mjpeg streams,
        and also jpeg with autorefresh
    ###
    tagName:   'section'
    className: 'feed-box'
    refresh_handle: undefined

    template: _.template("""<div class="feed-stream">
                            <img 
                                caption="<%= city %>" >
                            </div>"""),

    initialize: (@name) ->
        @model.bind 'add', @render
        @model.bind 'change', @render

    cycle: (new_feed) =>
        @model.set( 'city', new_feed.get('city') )
        @model.set( 'country', new_feed.get('country') )
        @model.set( 'uri', new_feed.get('uri') )

    refreshImage: =>
        uri = @model.get('uri')
        epd = if uri.search('\\?') > 0 then '&fps=' else '?fps='
        $('img',@el).attr('src', 
            uri + epd + _.random(0,100))

    autoRefresh: =>
        return if @refresh_handle?

        # Refresh if it's image and not a fucking .mjpg stream
        if not @model.get('uri').endsWith('.mjpg')
            @refresh_handle = setInterval( @refreshImage, 1000/ Settings.camfeed.fps )
            console.log("refresh camera handle: #{@refresh_handle}")

    preload: (new_feed, ok_cb, fail_cb) =>
        $("<img/>")
            .on('load', =>
                ok_cb(@)
            ).on('error', =>
                fail_cb(@)
            ).attr('src', new_feed.get('uri'))

    render: =>
        clearInterval if @refresh_handle?
        $(@el).html( @template( @model.toJSON() ) )
        $(@el).addClass('blackwhite') if(Settings.css.blackwhite)

        # Load Ok, show image
        $('img',@el).on('load', =>
            @autoRefresh()
            $('img',@el).addClass('visible')

        # Ops, error on this image. Let's cycle
        # And avoid showing it again!
        ).on('error', =>
            console.log("Failed loading #{@model.get('uri')}")
            CAMFEEDS.setRandomProbability( @model, 0 );
            @cycle(  CAMFEEDS.pickSemiRandom( ) )
        ).attr('src', @model.get('uri'))

        return @

    hidePhoto: (cb) =>
        $('img', @el).one(ANIM_END, (e) =>
            $(this).hide();
            cb()
        ).removeClass('visible')

    unrender: =>
        if @refresh_handle?
            clearInterval(@refresh_handle)





class AppBigBrother extends Backbone.View

    el:  '#cameralist'
    cameras: [],
    events: {
        'click #bt-cyclecameras': 'cycleCameras'
    },
    started: false

    initialize: (@settings) ->
        @cam_one = CAMFEEDS.pickSemiRandom()
        #@cam_two = CAMFEEDS.pickSemiRandom()


    start: =>
        @appendCamera( @cam_one  )
        #@appendCamera( @cam_two )
        @render()

    setAutoCycle: =>
        # Cycle camera 0
        setTimeout( =>
            setInterval( =>
                @cycleCamera(0)
            , Settings.cycle.interval)
        , Settings.cycle.offset)

        # Cycle camera 1
        #setInterval( =>
        #    @cycleCamera(1)
        #, Settings.cycle.interval)

    appendCamera: (camera_stream) ->
        cam = new Camera model: camera_stream
        @cameras.push( cam )
        $(@el).append cam.render().el


    cycleCamera: (camera_idx=0) =>
        cam = @cameras[camera_idx]
        cam_data = CAMFEEDS.pickSemiRandom()

        console.group("cyclecamera","Cycling camera #{camera_idx} to #{cam_data.get('uri')}")
        cam.preload( cam_data ,  =>
                # OK
                console.log("Feed #{cam_data.get('uri')} preloaded correctly. Hiding the current camera(#{camera_idx}), and showing the next")
                cam.cycle(cam_data)
                cam.hidePhoto( =>
                    cam.cycle(cam_data)
                    console.groupEnd("cyclecamera")
                )
            # FAIL
            # Ops, error on this image. Let's cycle
            # And avoid showing it again!
            , =>
                cam_idx = camera_idx
                console.error( "Cam #{cam_idx}:" , cam.model.get('uri') , ' - ERROR')

                console.groupEnd("cyclecamera")

                CAMFEEDS.setRandomProbability( cam.model, 0 )
                window.app.cycleCamera(cam_idx)
        )

    render: ->
        $(@el).html()

start = ->
    toggleFullscreen()
    window.app.setAutoCycle()

    $('body').addClass('nocursor');
    $('#overlay').addClass('hidden');
    $(window.app.el).removeClass('blur').addClass('noblur')

    window.app.started = true;

SEC = (x) =>
    x * Math.pow(x,3)

window.CAMFEEDS=[]
window.app = null
jQuery ->

    window.gui = gui = new dat.GUI();
    gui.add(Settings.camfeed, 'fps', 1, 1/3.0);
    gui.add(Settings.cycle, 'interval')
    gui.add(Settings.cycle, 'offset')
    gui.add(Settings.css, 'blackwhite')
    $(gui.domElement).addClass('hidden')

    $.getJSON Settings.camfeed.url, (feeds) ->
        window.CAMFEEDS = new CameraFeeds
        _.each( feeds, (feed) =>
            stream = new CameraStream( feed  )
            window.CAMFEEDS.add stream
        )
        window.app = new AppBigBrother( Settings )
        window.app.start()
    
    Mousetrap.bind(['Command+,','P'], =>
            $(gui.domElement).toggleClass('hidden')
    )
    Mousetrap.bind([' ','enter'], =>
        start() if not (window.app.started)
    )
    Mousetrap.bind(['command+f'], =>
        toggleFullscreen()
        return false
    )

    $('#overlay').on 'click', start
    #$('#overlay').hide()
