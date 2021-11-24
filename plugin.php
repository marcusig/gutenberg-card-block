<?php
/**
 * Plugin Name: Cease Blocks
 * Description: Variety of blocks done for Cease, forked from https://github.com/sergeycode/sc-cards
 * Author: mklacroix,sergeycode
 * Author URI: https://mklacroix.com
 * Version: 1.0.0
 * License: GPL2+
 * License URI: https://www.gnu.org/licenses/gpl-2.0.txt
 *
 * @package CGB
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Block Initializer.
 */
require_once plugin_dir_path( __FILE__ ) . 'src/init.php';
