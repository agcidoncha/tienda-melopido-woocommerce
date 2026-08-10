/**
 * Alterna el estado visual activo/inactivo entre los botones "Galería" / "Vídeo"
 * de la página de producto. El mostrar/ocultar de los paneles ya lo hacen las
 * Interactions nativas de Bricks (show/hide); esto solo intercambia las clases
 * globales nativas "toggle-boton-activo" / "toggle-boton-inactivo" entre ambos
 * botones, porque el elemento "button" de Bricks sin enlace se renderiza como
 * <span> y nunca puede recibir :focus, así que no hay forma 100% nativa de
 * marcar cuál está seleccionado.
 *
 * También pausa el vídeo al volver a "Galería", para que no siga sonando
 * de fondo mientras está oculto.
 */
document.addEventListener( 'DOMContentLoaded', function () {
	var btnGaleria = document.getElementById( 'brxe-btngal' );
	var btnVideo = document.getElementById( 'brxe-btnvid' );
	var videoBox = document.getElementById( 'brxe-vidbox' );

	if ( ! btnGaleria || ! btnVideo ) {
		return;
	}

	var ACTIVE_CLASS = 'toggle-boton-activo';
	var INACTIVE_CLASS = 'toggle-boton-inactivo';

	function setActive( active, inactive ) {
		active.classList.remove( INACTIVE_CLASS );
		active.classList.add( ACTIVE_CLASS );
		inactive.classList.remove( ACTIVE_CLASS );
		inactive.classList.add( INACTIVE_CLASS );
	}

	function pauseVideo() {
		var video = videoBox ? videoBox.querySelector( 'video' ) : null;
		if ( video ) {
			video.pause();
		}
	}

	btnGaleria.addEventListener( 'click', function () {
		setActive( btnGaleria, btnVideo );
		pauseVideo();
	} );

	btnVideo.addEventListener( 'click', function () {
		setActive( btnVideo, btnGaleria );
	} );
} );
