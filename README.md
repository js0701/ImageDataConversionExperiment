This repo contains Crosswalk experimental release(based on crosswalk-14/43.0.2357.130) with implementation of interface ImageData conversion extension proposed in
http://wicg.github.io/img-conversion/

The experiment adjust 2 IDLs in Blink to bring asynchronous image decode/encode to Web:
ImageDataHandle.idl:
interface ImageDataHandle {
    readonly attribute long width;
    readonly attribute long height;

    [CallWith=ScriptState]    Promise<Blob>  toBlob (optional DOMString type, optional Dictionary encoderOptions);
    [CallWith=ScriptState]    static Promise<ImageDataHandle> createFromSource(HTMLImageElement source);
    [CallWith=ScriptState]    static Promise<ImageDataHandle> createFromSource(Blob source);
    static DOMString          canDecodeType (DOMString mimeType);
    static DOMString          canEncodeType (DOMString mimeType);
    void                      releaseLocalBuffer();
};

and ImageData.idl
interface ImageData : ImageDataHandle {
    [CallWith=ScriptState]    static Promise<ImageData> createFromSource(HTMLImageElement source);
    [CallWith=ScriptState]    static Promise<ImageData> createFromSource(Blob source);
    readonly attribute Uint8ClampedArray data;
};

Also 2 samples for using ImageData conversion extension are listed in directory samples:

1: PictureProcessing:
   It shows a demo for processing 32 pictures and show them in canvas. The processing is simply swap RGB value here. The demo is accelerated by createFromSource interface.
2: WebGLImage:
   It is a demo for convert HTMLImageElement to texture and use WebGL to show a cubic with the texture mapped. With the ImageData extension, we can use createFromSource to decode HTMLImageElement to ImageDataHandle(use this interface for it bring releaseLocalBuffer for native pixel buffer releasing, which we find is important for heavy memory scenerarios), can use glTexImage2D to upload ImageDataHandle as texture, which is faster than use HTMLImageElement directly.

Note: In both samples, ImageData conversion extension is used by default, but you can turn it off by set "useImageDataExtension = false" to see the performance differences.

The same way for making apks with Crosswalk Wiki page:
python ./make_apk.py --manifest=./samples/PictureProcessing/manifest.json --package=org.xwalk.pictureprocessing --name=pictureprocessing --enable-remote-debugging
python ./make_apk.py --manifest=./samples/WebGLImage/manifest.json --package=org.xwalk.webglimage --name=webglimage --enable-remote-debugging
