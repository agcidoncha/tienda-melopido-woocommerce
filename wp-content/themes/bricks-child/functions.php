<?php
/**
 * [2026-09-11] Migas de pan: se quita el último tramo (la página actual).
 * WooCommerce lo añade siempre con su propio enlace (aunque la plantilla
 * nunca lo pinte como link, por ser el último), así que no basta con
 * comprobar si el enlace está vacío — hay que quitarlo sin condición. Es
 * texto suelto sin su propia etiqueta —no hay control nativo en el
 * elemento de Bricks para ocultar solo ese tramo— y además es redundante
 * con el título de la página, que ya lo repite justo debajo. Sin este
 * tramo, la miga de pan es más corta y cabe en una línea en móvil.
 */
add_filter( 'woocommerce_get_breadcrumb', function( $crumbs ) {
	if ( count( $crumbs ) > 1 ) {
		array_pop( $crumbs );
	}

	return $crumbs;
} );

/**
 * El enlace para deshacer la variación seleccionada usa el texto "Limpiar"
 * (cadena traducida del núcleo de WooCommerce). Lo sustituimos por "Quitar",
 * que describe mejor la acción, sin tocar plantillas ni el DOM.
 */
add_filter( 'gettext', function ( $translated, $original, $domain ) {
	if ( 'woocommerce' === $domain && 'Clear' === $original ) {
		return 'Quitar';
	}

	return $translated;
}, 10, 3 );

/**
 * Register/enqueue custom scripts and styles
 */
add_action( 'wp_enqueue_scripts', function() {
	wp_enqueue_style( 'bricks-child', get_stylesheet_uri(), ['bricks-frontend'], filemtime( get_stylesheet_directory() . '/style.css' ) );

	// Estilos del minicarrito del header (en todas las páginas, no solo producto)
	wp_enqueue_style(
		'minicart',
		get_stylesheet_directory_uri() . '/css/minicart.css',
		[ 'bricks-child' ],
		filemtime( get_stylesheet_directory() . '/css/minicart.css' )
	);

	// Oculta el precio del minicarrito del header cuando el carrito está vacío
	// (en todas las páginas, no solo producto)
	wp_enqueue_style(
		'minicart-subtotal-vacio',
		get_stylesheet_directory_uri() . '/css/minicart-subtotal-vacio.css',
		[ 'bricks-child' ],
		filemtime( get_stylesheet_directory() . '/css/minicart-subtotal-vacio.css' )
	);

	// Red de seguridad para la carga diferida de Bricks (ver comentario
	// dentro del archivo): en todas las páginas, es un fallo del propio
	// Bricks, no algo específico de una plantilla.
	wp_enqueue_script(
		'lazy-load-fallback',
		get_stylesheet_directory_uri() . '/js/lazy-load-fallback.js',
		[ 'bricks-scripts' ],
		filemtime( get_stylesheet_directory() . '/js/lazy-load-fallback.js' ),
		true
	);

	// Causa real del CLS de la home (ver comentario dentro del archivo):
	// la altura del deslizador del hero la fija Splide por JavaScript, no
	// CSS. Solo hace falta en portada.
	if ( is_front_page() ) {
		wp_enqueue_style(
			'hero-slider-height',
			get_stylesheet_directory_uri() . '/css/hero-slider-height.css',
			[ 'bricks-child' ],
			filemtime( get_stylesheet_directory() . '/css/hero-slider-height.css' )
		);
	}

	// Espaciado de párrafos consecutivos (en todas las páginas)
	wp_enqueue_style(
		'global-text-spacing',
		get_stylesheet_directory_uri() . '/css/global-text-spacing.css',
		[ 'bricks-child' ],
		filemtime( get_stylesheet_directory() . '/css/global-text-spacing.css' )
	);

	// Estilos y script del selector de color de variaciones (solo en página de producto individual)
	if ( function_exists( 'is_product' ) && is_product() ) {
		wp_enqueue_style(
			'selector-color-carrito',
			get_stylesheet_directory_uri() . '/css/selector-color-carrito.css',
			[ 'bricks-child' ],
			filemtime( get_stylesheet_directory() . '/css/selector-color-carrito.css' )
		);

		wp_enqueue_style(
			'medida-selector',
			get_stylesheet_directory_uri() . '/css/medida-selector.css',
			[ 'bricks-child' ],
			filemtime( get_stylesheet_directory() . '/css/medida-selector.css' )
		);

		wp_enqueue_script(
			'selector-color-carrito',
			get_stylesheet_directory_uri() . '/js/selector-color-carrito.js',
			[],
			filemtime( get_stylesheet_directory() . '/js/selector-color-carrito.js' ),
			true
		);

		wp_enqueue_style(
			'quiz-color',
			get_stylesheet_directory_uri() . '/css/quiz-color.css',
			[ 'bricks-child' ],
			filemtime( get_stylesheet_directory() . '/css/quiz-color.css' )
		);

		wp_enqueue_script(
			'quiz-color',
			get_stylesheet_directory_uri() . '/js/quiz-color.js',
			[],
			filemtime( get_stylesheet_directory() . '/js/quiz-color.js' ),
			true
		);

		wp_enqueue_script(
			'galeria-video-toggle',
			get_stylesheet_directory_uri() . '/js/galeria-video-toggle.js',
			[],
			filemtime( get_stylesheet_directory() . '/js/galeria-video-toggle.js' ),
			true
		);

		wp_enqueue_script(
			'precio-cantidad-dinamico',
			get_stylesheet_directory_uri() . '/js/precio-cantidad-dinamico.js',
			[ 'jquery' ],
			filemtime( get_stylesheet_directory() . '/js/precio-cantidad-dinamico.js' ),
			true
		);

		wp_enqueue_script(
			'seleccion-obligatoria-color',
			get_stylesheet_directory_uri() . '/js/seleccion-obligatoria-color.js',
			[ 'jquery' ],
			filemtime( get_stylesheet_directory() . '/js/seleccion-obligatoria-color.js' ),
			true
		);

		wp_enqueue_script(
			'barra-sticky-movil',
			get_stylesheet_directory_uri() . '/js/barra-sticky-movil.js',
			[],
			filemtime( get_stylesheet_directory() . '/js/barra-sticky-movil.js' ),
			true
		);

		wp_enqueue_script(
			'confirmacion-carrito',
			get_stylesheet_directory_uri() . '/js/confirmacion-carrito.js',
			[ 'jquery', 'wc-add-to-cart' ],
			filemtime( get_stylesheet_directory() . '/js/confirmacion-carrito.js' ),
			true
		);
	}
} );

/**
 * Dynamic tag {measure}: título del producto sin el prefijo "Funda de
 * Seda ", para mostrar solo la medida (ej. "150×45 cm") en la ficha sin
 * depender de un campo aparte que haya que mantener por producto.
 */
add_filter( 'bricks/dynamic_tags_list', function( $tags ) {
	$tags[] = [
		'name'  => '{measure}',
		'label' => 'Medida (sin prefijo "Funda de Seda")',
		'group' => 'Custom',
	];
	$tags[] = [
		'name'  => '{measure_link}',
		'label' => 'Enlace de medida (la medida actual sale sin enlace)',
		'group' => 'Custom',
	];
	$tags[] = [
		'name'  => '{random_hero_video}',
		'label' => 'Vídeo aleatorio del hero (carpeta /video/)',
		'group' => 'Custom',
	];
	$tags[] = [
		'name'  => '{random_hero_video_poster}',
		'label' => 'Póster del vídeo aleatorio del hero (mismo archivo elegido, en .jpg)',
		'group' => 'Custom',
	];

	return $tags;
} );

function melopido_get_measure_from_title( $post_id ) {
	$title = get_the_title( $post_id );

	return trim( str_ireplace( 'Funda de Seda', '', $title ) );
}

/**
 * Fila "Otras medidas": en vez de excluir la medida actual del listado
 * (dejando 5 botones, 3+2), se incluyen las 6 y la actual se renderiza
 * como texto sin enlace, para que la fila de 6 forme siempre 2x3.
 */
function melopido_render_measure_link( $post_id ) {
	$measure = melopido_get_measure_from_title( $post_id );

	if ( (int) $post_id === (int) get_queried_object_id() ) {
		return '<span class="medida-actual-deshabilitada">' . esc_html( $measure ) . '</span>';
	}

	return '<a href="' . esc_url( get_permalink( $post_id ) ) . '">' . esc_html( $measure ) . '</a>';
}

/**
 * Fondo de vídeo del hero: elige al azar, en cada carga de página, uno de
 * los archivos "hero-*.mp4" presentes en /video/. Añadir un vídeo nuevo es
 * subir el .mp4 con ese patrón de nombre MÁS un póster con el mismo
 * nombre en .jpg (ej. hero-3.mp4 + hero-3.jpg) — no hace falta tocar
 * código ni el número de vídeos disponibles. Si falta el .jpg de alguno,
 * ese vídeo se sigue eligiendo pero sin póster (degradación aceptable).
 *
 * El vídeo y su póster se eligen juntos (misma variable estática) para
 * que siempre coincidan entre sí — antes, con un póster fijo, al elegir
 * un vídeo distinto se veía el póster de otro vídeo durante un instante.
 *
 * Se resuelve en PHP (no en JS) para que el HTML ya llegue con la URL
 * correcta: el elemento "video" de Bricks carga el vídeo mediante
 * "data-src" (lazy load) y sustituirlo por JS tras la carga competiría con
 * ese mismo mecanismo.
 */
function melopido_get_random_hero_media() {
	static $media = null;

	if ( $media === null ) {
		$files = glob( ABSPATH . 'video/hero-*.mp4' );

		if ( empty( $files ) ) {
			$media = [
				'video'  => '',
				'poster' => '',
			];
		} else {
			$file        = $files[ array_rand( $files ) ];
			$poster_file = preg_replace( '/\.mp4$/i', '.jpg', $file );

			$media = [
				'video'  => home_url( '/video/' . rawurlencode( basename( $file ) ) ),
				'poster' => file_exists( $poster_file ) ? home_url( '/video/' . rawurlencode( basename( $poster_file ) ) ) : '',
			];
		}
	}

	return $media;
}

function melopido_get_random_hero_video() {
	return melopido_get_random_hero_media()['video'];
}

function melopido_get_random_hero_video_poster() {
	return melopido_get_random_hero_media()['poster'];
}

/**
 * [2026-09-12] Precarga el vídeo del hero (LCP de la home en Lighthouse:
 * 5,0s en móvil). Bricks marca el elemento "video" con "data-src" (carga
 * en diferido) sin ningún ajuste nativo para evitarlo — ni en el propio
 * elemento ni en el deslizador que lo contiene —, así que el navegador
 * no se entera de que hace falta hasta que corre el JavaScript del
 * lazy-load. Con este preload, apuntando al mismo vídeo que ya elige
 * {random_hero_video} (misma función, incluida la caché de la petición,
 * así que siempre coincide con el que se acaba renderizando), el
 * navegador empieza a descargarlo desde el primer instante.
 */
add_action( 'wp_head', function () {
	if ( ! is_front_page() ) {
		return;
	}

	$video_url = melopido_get_random_hero_video();

	if ( ! $video_url ) {
		return;
	}

	printf(
		'<link rel="preload" as="video" href="%s" fetchpriority="high">' . "\n",
		esc_url( $video_url )
	);
}, 1 );

add_filter( 'bricks/dynamic_data/render_tag', function( $tag, $post, $context = 'text' ) {
	if ( $tag === 'measure' || $tag === '{measure}' ) {
		return melopido_get_measure_from_title( $post->ID );
	}

	if ( $tag === 'measure_link' || $tag === '{measure_link}' ) {
		return melopido_render_measure_link( $post->ID );
	}

	if ( $tag === 'random_hero_video' || $tag === '{random_hero_video}' ) {
		return melopido_get_random_hero_video();
	}

	if ( $tag === 'random_hero_video_poster' || $tag === '{random_hero_video_poster}' ) {
		return melopido_get_random_hero_video_poster();
	}

	return $tag;
}, 10, 3 );

add_filter( 'bricks/dynamic_data/render_content', function( $content, $post, $context = 'text' ) {
	if ( strpos( $content, '{measure}' ) !== false ) {
		$content = str_replace( '{measure}', melopido_get_measure_from_title( $post->ID ), $content );
	}

	if ( strpos( $content, '{measure_link}' ) !== false ) {
		$content = str_replace( '{measure_link}', melopido_render_measure_link( $post->ID ), $content );
	}

	if ( strpos( $content, '{random_hero_video}' ) !== false ) {
		$content = str_replace( '{random_hero_video}', melopido_get_random_hero_video(), $content );
	}

	if ( strpos( $content, '{random_hero_video_poster}' ) !== false ) {
		$content = str_replace( '{random_hero_video_poster}', melopido_get_random_hero_video_poster(), $content );
	}

	return $content;
}, 10, 3 );

/**
 * Register custom elements
 */
add_action( 'init', function() {
  $element_files = [
    __DIR__ . '/elements/title.php',
  ];

  foreach ( $element_files as $file ) {
    \Bricks\Elements::register_element( $file );
  }
}, 11 );

/**
 * Filter which elements to show in the builder
 *
 * Simple outcomment (prefix: //) the elements you don't want to use in Bricks
 */
function bricks_filter_builder_elements( $elements ) {
	$elements = [
		// Basic
		// 'container', // since 1.2
		// 'heading',
		'text',
		'button',
		'icon',
		'image',
		'video',

		// General
		'divider',
		'icon-box',
		'list',
		'accordion',
		'tabs',
		'form',
		'map',
		'alert',
		'animated-typing',
		'countdown',
		'counter',
		'pricing-tables',
		'progress-bar',
		'pie-chart',
		'team-members',
		'testimonials',
		'html',
		'code',
		'logo',

		// Media
		'image-gallery',
		'audio',
		'carousel',
		'slider',
		'svg',

		// Social
		'social-icons',
		'facebook-page',
		'instagram-feed',

		// WordPress
		'wordpress',
		'posts',
		'nav-menu',
		'sidebar',
		'search',
		'shortcode',

		// Single
		'post-title',
		'post-excerpt',
		'post-meta',
		'post-content',
		'post-sharing',
		'post-related-posts',
		'post-author',
		'post-comments',
		'post-taxonomy',
		'post-navigation',

		// Hidden in builder panel
		'section',
		'row',
		'column',
	];

	return $elements;
}
// add_filter( 'bricks/builder/elements', 'bricks_filter_builder_elements' );

/**
 * Add text strings to builder
 */
add_filter( 'bricks/builder/i18n', function( $i18n ) {
  // For element category 'custom'
  $i18n['custom'] = esc_html__( 'Custom', 'bricks' );

  return $i18n;
} );

/**
 * Custom save messages
 */
add_filter( 'bricks/builder/save_messages', function( $messages ) {
	// First option: Add individual save message
	$messages[] = 'Yasss';

	// Second option: Replace all save messages
	$messages = [
		'Done',
		'Cool',
		'High five!',
	];

  return $messages;
} );

/**
 * Customize standard fonts
 */
// add_filter( 'bricks/builder/standard_fonts', function( $standard_fonts ) {
// 	// First option: Add individual standard font
// 	$standard_fonts[] = 'Verdana';

// 	// Second option: Replace all standard fonts
// 	$standard_fonts = [
// 		'Georgia',
// 		'Times New Roman',
// 		'Verdana',
// 	];

//   return $standard_fonts;
// } );

/**
 * Add custom map style
 */
// add_filter( 'bricks/builder/map_styles', function( $map_styles ) {
//   // Shades of grey (https://snazzymaps.com/style/38/shades-of-grey)
//   $map_styles['shadesOfGrey'] = [
//     'label' => esc_html__( 'Shades of grey', 'bricks' ),
//     'style' => '[ { "featureType": "all", "elementType": "labels.text.fill", "stylers": [ { "saturation": 36 }, { "color": "#000000" }, { "lightness": 40 } ] }, { "featureType": "all", "elementType": "labels.text.stroke", "stylers": [ { "visibility": "on" }, { "color": "#000000" }, { "lightness": 16 } ] }, { "featureType": "all", "elementType": "labels.icon", "stylers": [ { "visibility": "off" } ] }, { "featureType": "administrative", "elementType": "geometry.fill", "stylers": [ { "color": "#000000" }, { "lightness": 20 } ] }, { "featureType": "administrative", "elementType": "geometry.stroke", "stylers": [ { "color": "#000000" }, { "lightness": 17 }, { "weight": 1.2 } ] }, { "featureType": "landscape", "elementType": "geometry", "stylers": [ { "color": "#000000" }, { "lightness": 20 } ] }, { "featureType": "poi", "elementType": "geometry", "stylers": [ { "color": "#000000" }, { "lightness": 21 } ] }, { "featureType": "road.highway", "elementType": "geometry.fill", "stylers": [ { "color": "#000000" }, { "lightness": 17 } ] }, { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [ { "color": "#000000" }, { "lightness": 29 }, { "weight": 0.2 } ] }, { "featureType": "road.arterial", "elementType": "geometry", "stylers": [ { "color": "#000000" }, { "lightness": 18 } ] }, { "featureType": "road.local", "elementType": "geometry", "stylers": [ { "color": "#000000" }, { "lightness": 16 } ] }, { "featureType": "transit", "elementType": "geometry", "stylers": [ { "color": "#000000" }, { "lightness": 19 } ] }, { "featureType": "water", "elementType": "geometry", "stylers": [ { "color": "#000000" }, { "lightness": 17 } ] } ]'
//   ];

//   return $map_styles;
// } );
