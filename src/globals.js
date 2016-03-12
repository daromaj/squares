//import dependencies

var Engine = famous.core.Engine;
var Modifier = famous.core.Modifier;
var StateModifier = famous.modifiers.StateModifier;
var Transform = famous.core.Transform;
//var ImageSurface = famous.surfaces.ImageSurface;
var Surface = famous.core.Surface;
var FlexibleLayout = famous.views.FlexibleLayout;
var SequentialLayout = famous.views.SequentialLayout;
var EventHandler = famous.core.EventHandler;
var MouseSync = famous.inputs.MouseSync;
var TouchSync = famous.inputs.ScrollSync;
var GenericSync = famous.inputs.GenericSync;
var Timer = famous.utilities.Timer;
var View = famous.core.View;
var Easing = famous.transitions.Easing;

GenericSync.register({
    'mouse': MouseSync
});

var sync = new GenericSync(['mouse', 'touch']);