
// <!-- pass through fragment shader -->
// <script id="fragmentShader" type="x-shader/x-fragment">

uniform vec2 resolution;
uniform float time;
uniform sampler2D texture;

void main() {

    vec2 uv = gl_FragCoord.xy / resolution.xy;

    vec3 color = texture2D( texture, uv ).xyz;

    gl_FragColor = vec4( color, 1.0 );

}
