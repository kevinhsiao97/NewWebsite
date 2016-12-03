var CustomMat = function (texturePath, shader) {

    //var texture = onepixLoadTexture(texturePath);
    var texture = THREE.ImageUtils.loadTexture(texturePath); //其實不需要額外設function  onepixLoadTexture(texturePath);

    var uniforms = THREE.UniformsUtils.clone(shader.uniforms);

    uniforms[ "texture1" ].value = texture;
    uniforms['scale'].value = 0.5;


    var parameters = {

        fragmentShader: shader.fragmentShader,
        vertexShader: shader.vertexShader,
        uniforms: uniforms,
    };
    //這裡的uniforms已被修改過，已經有了texture的路徑
    return new THREE.ShaderMaterial(parameters);

    
    
};


//used to load textures
function onepixLoadTexture(path) {

    // texture - texture must not be in same folder or there is an error.
    var texture = THREE.ImageUtils.loadTexture(path);

    return texture;
}


