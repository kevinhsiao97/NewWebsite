THREE.DisplacementShader = {



	uniforms: {
            texture1: { type: "t", value: null }, // 這邊的 "t" 是指texture, value要給一個texture連結的位址
            scale: { type: "f", value: 0.05 },
	},

	vertexShader: [

                        "varying vec2 vUv;",//从定点shader 传递到 片段shader的纹理坐标
                        "varying float noise;",
                        "varying float noise2;",
                        "varying vec3 fNormal;",
                        "uniform sampler2D texture1;",
                        "uniform float scale;",

                        "void main() {",

                            "vUv = uv;", //uv 是默认存在的顶点属性， 用于做纹理坐标
                            "fNormal = normal;",

                            "vec4 noiseTex = texture2D( texture1, vUv );",

                            "noise = noiseTex.r;",
                            "noise *= 1.5;",
                            "noise2 = noise;",
                            "noise2 *= 1.1;",
                            //adding the normal scales it outward
                            //(normal scale equals sphere diameter)
                            "vec3 newPosition = position + normal * noise * scale;",

                            "gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1 );",
                            // projectionMatrix 默认存在的投影矩阵
                            // modelViewMatrix默认模型视图矩阵
                            // 默认position定点坐标
                        "}"

	].join("\n"),

	fragmentShader: [

			"varying vec2 vUv;",
            "varying float noise;",
            "varying float noise2;",
            "varying vec3 fNormal;",


			"void main( void ) {",
                            
                            // compose the colour using the normals then
                            // whatever is heightened by the noise is lighter
                            "gl_FragColor = vec4( vec3(vUv[0]*0.8, vUv[1]*0.8, 1) * noise2 , 1. );",
             //改色方式1    //"gl_FragColor = vec4( fNormal * noise2 , 1. );",
             //改色方式2    //"gl_FragColor = vec4( vec3(noise2,noise,noise) * noise, 1. );",

                        "}"

	].join("\n")

};