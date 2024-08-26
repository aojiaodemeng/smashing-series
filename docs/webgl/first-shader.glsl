#iChannel0"https://s2.loli.net/2023/09/10/QozT59R6KsYmb3q.jpg"
void mainImage(out vec4 fragColor,in vec2 fragCoord){
  vec2 uv=fragCoord/iResolution.xy;
  uv=(uv-.5)*2.;
  uv.x*=iResolution.x/iResolution.y;
  float d=length(uv);
  d-=.5;
  // float c=step(0.,d);
  float c=smoothstep(0.,.02,d);
  fragColor=vec4(vec3(c),1.);
  
  vec3 tex=texture(iChannel0,uv).xyz;
  fragColor=vec4(tex,1.);
}
